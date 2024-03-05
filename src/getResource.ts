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
    const description = getDescription($);
    const domain = getDomainName($, url);

    return {
        title,
        description,
        domain,
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

function getDescription($: CheerioAPI) {
    const ogDescription = $('meta[property="og:description"]')[0];
    if (ogDescription != null) {
        return $(ogDescription).attr('content') || '';
    }

    const twitterDescription = $('meta[name="twitter:description"]')[0];
    if (twitterDescription != null) {
        return $(twitterDescription).attr('content') || '';
    }

    const metaDescription = $('meta[name="description"]')[0];
    if (metaDescription != null) {
        return $(metaDescription).attr('content') || '';
    }

    const paragraphs = $('p');
    let fstVisibleParagraph = '';
    for (const paragraph of paragraphs) {
        if (
            // if object is visible in dom
            paragraph.parent !== null &&
            paragraph.children.length > 0
        ) {
            fstVisibleParagraph = $(paragraph).text();
            break;
        }
    }
    return fstVisibleParagraph;
}

function getDomainName($: CheerioAPI, uri: string) {
    let domainName: string | null = null;

    const canonicalLink = $('link[rel=canonical]')[0];
    if (canonicalLink != null) {
        domainName = $(canonicalLink).attr('href') || null;
    }

    const ogUrlMeta = $('meta[property="og:url"]')[0];
    if (ogUrlMeta != null) {
        domainName = $(ogUrlMeta).text();
    }

    console.log('DOMAIN NAME :::', domainName);

    return domainName
        ? new URL(domainName).hostname.replace('www.', '')
        : new URL(uri).hostname.replace('www.', '');
}
