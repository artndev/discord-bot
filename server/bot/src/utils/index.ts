export const splitMessage = (text: string, limit = 2000): string[] => {
    const chunks: string[] = [];

    while (text.length > limit) {
        let sliceIndex = text.lastIndexOf('\n', limit);
        if (sliceIndex === -1) {
            sliceIndex = limit;
        }

        chunks.push(text.slice(0, sliceIndex));

        text = text.slice(sliceIndex).trim();
    }

    chunks.push(text);

    return chunks;
};
