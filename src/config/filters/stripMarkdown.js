module.exports = function (value) {
    return value
        // remove fenced code blocks
        .replace(/```[\s\S]*?```/g, "")
        // remove inline code
        .replace(/`([^`]+)`/g, "$1")
        // remove images
        .replace(/!\[.*?\]\(.*?\)/g, "")
        // remove links but keep text
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        // remove headings
        .replace(/^#{1,6}\s*/gm, "")
        // bold/italic
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/_(.*?)_/g, "$1")
        // blockquotes
        .replace(/^>\s?/gm, "")
        // lists
        .replace(/^\s*[-+*]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        // remove HTML tags
        .replace(/<\/?[^>]+(>|$)/g, "")
        // collapse whitespace
        .replace(/\s+/g, " ")
        .trim();
};