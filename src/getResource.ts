import type { CheerioAPI } from 'cheerio';
import { load } from 'cheerio';

interface Metadata {
    title: string;
    description: string;
    domain: string;
    image: string;
}

type Resource =
    | {
          type: 'image';
          data: string;
      }
    | {
          type: 'webpage';
          data: Metadata;
      };

export default async function getResource(url: string): Promise<Resource | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not `ok`');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType) throw new Error('Content type header is missing');
        console.log('contentType :::', contentType);
        if (contentType.startsWith('image/')) {
            return {
                type: 'image',
                data: url,
            };
        } else if (contentType.startsWith('text/html')) {
            const metadata = await getMetadata(url);
            if (!metadata) throw new Error('Could not find metadata');

            return {
                type: 'webpage',
                data: metadata,
            };
        } else {
            throw new Error(`Unknown content type: ${contentType}`);
        }
    } catch (error) {
        console.warn('Error checking content type:', error);
        return null;
    }
}

async function getMetadata(url: string): Promise<Metadata | null> {
    const response = await fetch(url);
    const result = await response.text();
    const $ = load(result);
    const title = getTitle($);
    return {
        title,
        description: '',
        domain: '',
        image: '',
    };
}

function getTitle($: CheerioAPI) {
    const ogTitle = $('meta[property="og:title"]')[0];
    if (ogTitle != null) {
        console.log($(ogTitle).attr('content'));
        return $(ogTitle).attr('content') || '';
    }
    const twitterTitle = $('meta[name="twitter:title"]')[0];
    if (twitterTitle != null) {
        return $(twitterTitle).attr('content') || '';
    }
    const h1 = $('h1')[0];
    if (h1 != null) {
        return $(h1).text();
    }
    const h2 = $('h2')[0];
    if (h2 != null) {
        return $(h2).text();
    }
    return '';
}
