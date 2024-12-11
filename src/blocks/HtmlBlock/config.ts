import { Block } from "payload";

export const HtmlBlock: Block = {
    slug: 'htmlBlock',
    interfaceName: 'HtmlBlock',
    fields: [
        {
            name: 'html',
            type: 'code',
            label: 'HTML',
            required: true,
        }
    ],
    labels: {
        plural: 'HTML Blocks',
        singular: 'HTML Block',
    },
}