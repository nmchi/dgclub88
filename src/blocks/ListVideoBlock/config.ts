import { Block } from "payload";

export const ListVideoBlock: Block = {
    slug: 'listVideoBlock',
    interfaceName: 'ListVideoBlock',
    fields: [
        // {
        //     name: 'category',
        //     type: 'select',
        //     label: 'Category',
        //     required: true,
        //     options: [
        //         { label: 'CPC2', value: 'cpc2' },
        //         { label: 'CPC3', value: 'cpc3' },
        //     ],
        // },
        {
            name: 'categories',
            type: 'relationship',
            hasMany: true,
            label: 'Categories To Show',
            relationTo: 'categories',
        },
        {
            name: 'isPublic',
            type: 'checkbox',
            label: 'Ispublic'
        },
    ],
};