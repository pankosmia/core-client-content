import {
    Document as DocxDocument,
    TextRun,
    Paragraph
} from 'docx';

const docxStyles = require('./docxStyles');

const actions = {
    startDocument: [
        {
            description: "Setup Workspace",
            test: () => true,
            action: ({context, workspace}) => {
                workspace.paragraphs = [];
                workspace.currentParagraph = [];
            }
        }
    ],
    blockGraft: [
        {
            description: "identity",
            test: ({context}) => ['heading', 'title'].includes(context.sequences[0].block.subType),
            action: (environment) => {
                const currentBlock = environment.context.sequences[0].block;
                if (currentBlock.sequence) {
                    const cachedSequencePointer = environment.workspace.currentSequence;
                    environment.context.renderer.renderSequence(environment);
                    environment.workspace.currentSequence = cachedSequencePointer;
                }
            }
        },
    ],
    startParagraph: [
        {
            description: "Push start para",
            test: () => true,
            action: ({context, workspace}) => {
                workspace.currentParagraph = [];
            }
        }
    ],
    startChapter: [
        {
            description: "Push chapter span",
            test: () => true,
            action: ({context, workspace}) => {
                workspace.currentParagraph.push({
                        text: context.sequences[0].element.atts.number,
                        type: "chapter"
                    })
            }
        }
    ],
    startVerses: [
        {
            description: "Push verse number",
            test: () => true,
            action: ({context, workspace}) => {
                workspace.currentParagraph.push({
                    text: context.sequences[0].element.atts.number,
                    type: "verse"
                })
            }
        }
    ],
    endParagraph: [
        {
            description: "Push heading end para",
            test: ({context}) => context.sequences[0].type === 'heading',
            action: ({workspace}) => {
                workspace.paragraphs.push({
                    children: workspace.currentParagraph,
                    type: "h2"
                })
            }
        },
        {
            description: "Push title end para",
            test: ({context}) => context.sequences[0].type === 'title',
            action: ({workspace}) => {
                workspace.paragraphs.push({
                    children: workspace.currentParagraph,
                    type: "h1"
                })
            }
        },
        {
            description: "Push vanilla end para",
            test: () => true,
            action: ({workspace}) => {
                workspace.paragraphs.push({
                    children: workspace.currentParagraph,
                    type: "body"
                })
            }
        }
    ],
    text: [
        {
            description: "Output text",
            test: () => true,
            action: ({context, workspace}) => {
                workspace.currentParagraph.push(
                    {
                        text: context.sequences[0].element.text,
                        type: "plain"
                    }
                );
            }
        }
    ],
    endDocument: [
        {
            description: "Make output",
            test: () => true,
            action: ({workspace, output}) => {
                output.doc = new DocxDocument({
                    description: "A brief example of using docx",
                    styles: docxStyles,
                    sections: [{
                        properties: {},
                        children: workspace.paragraphs
                            .map(
                                s => {
                                    const paraOb = {
                                        children: s.children.map(c => {
                                            if (c.type === 'plain') {
                                                return new TextRun(c.text);
                                            } else {
                                                return new TextRun({text: c.text, style: c.type});
                                            }
                                        }),
                                        style: s.type
                                    };
                                    return new Paragraph(paraOb);
                                }
                            )
                    }
                    ]
                });
                console.log("output", output);
            }
        }
    ]
};

export default actions;
