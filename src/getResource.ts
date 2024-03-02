// interface Metadata {
//     title: string;
//     description: string;
//     domain: string;
//     image: string;
// }

interface Resource {
    type: 'image';
    data: string;
}
// | {
//       type: 'webpage';
//       data: Metadata;
//   };

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
            // } else if (contentType.startsWith('text/html')) {
            //     const metadata = await getMetadata(url);
            //     if (!metadata) throw new Error('Could not find metadata');

            //     return {
            //         type: 'webpage',
            //         data: metadata,
            //     };
        } else {
            throw new Error(`Unknown content type: ${contentType}`);
        }
    } catch (error) {
        console.warn('Error checking content type:', error);
        return null;
    }
}

// async function getMetadata(url: string): Promise<Metadata | null> {
//     console.log(url);
//     return null;
// }
