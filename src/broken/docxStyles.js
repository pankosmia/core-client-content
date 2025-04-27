// Styling documentation at https://docx.js.org/#/usage/styling-with-js?id=available-options

const docxStyles = {
    paragraphStyles: [
        {
            id: "h1",
            name: "H1",
            basedOn: "Normal",
            next: "Normal",
            run: {
                size: 64,
                italics: true,
                color: "008000",
            },
            paragraph: {
                alignment: "center",
                spacing: {
                    after: 120,
                },
            }
        },
        {
            id: "h2",
            name: "H2",
            basedOn: "Normal",
            next: "Normal",
            run: {
                size: 48,
                bold: true,
                italics: true,
                color: "000040",
            },
            paragraph: {
                alignment: "center",
                spacing: {
                    after: 120,
                },
            }
        },
        {
            id: "body",
            name: "Body",
            basedOn: "Normal",
            next: "Normal",
            run: {
                size: 28,
            },
            paragraph: {
                spacing: {
                    after: 120,
                },
            }
        }
    ],
    characterStyles: [
        {
            id: "chapter",
            name: "Chapter",
            basedOn: "Normal",
            next: "Normal",
            run: {
                size: 54,
                bold: false,
                italics: false,
                color: "0000FF"
            },
        },
        {
            id: "verse",
            name: "Verse",
            basedOn: "Normal",
            next: "Normal",
            run: {
                bold: true,
                superScript: true,
            },
        }
    ]
};

export default docxStyles;
