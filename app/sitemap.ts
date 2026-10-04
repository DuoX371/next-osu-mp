import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://osump.chooh.moe',
        },
        {
            url: 'https://osump.chooh.moe/about',
        },
    ];
}
