const Item = require("./models/Item");

const MATCH_THRESHOLD = 70;

const normalize = (value) => String(value || "").trim().toLowerCase();

const textSimilarity = (first, second) => {
    const left = normalize(first);
    const right = normalize(second);
    if (!left || !right) return 0;
    if (left === right) return 1;
    if (left.includes(right) || right.includes(left)) return 0.8;

    const leftWords = new Set(left.split(/[^a-z0-9]+/).filter(Boolean));
    const rightWords = new Set(right.split(/[^a-z0-9]+/).filter(Boolean));
    const intersection = [...leftWords].filter((word) => rightWords.has(word)).length;
    const union = new Set([...leftWords, ...rightWords]).size;
    return union ? intersection / union : 0;
};

const dateSimilarity = (first, second) => {
    if (!first || !second) return 0;
    const firstTime = new Date(first).getTime();
    const secondTime = new Date(second).getTime();
    if (Number.isNaN(firstTime) || Number.isNaN(secondTime)) return 0;

    const daysApart = Math.abs(firstTime - secondTime) / (1000 * 60 * 60 * 24);
    if (daysApart <= 1) return 1;
    if (daysApart <= 7) return 0.6;
    if (daysApart <= 30) return 0.25;
    return 0;
};

const matchingScore = (item, otherItem) => {
    if (!item || !otherItem || normalize(item.type) === normalize(otherItem.type)) {
        return 0;
    }

    const score =
        textSimilarity(item.name, otherItem.name) * 30 +
        textSimilarity(item.description, otherItem.description) * 20 +
        (normalize(item.category) === normalize(otherItem.category) ? 15 : 0) +
        textSimilarity(item.color, otherItem.color) * 10 +
        textSimilarity(item.location, otherItem.location) * 15 +
        dateSimilarity(item.date, otherItem.date) * 10;

    return Math.round(score);
};

const matchingAlgo = async (item) => {
    if (!item || !["lost", "found"].includes(normalize(item.type))) {
        return [];
    }

    const oppositeType = normalize(item.type) === "lost" ? "found" : "lost";
    const candidates = await Item.find({
        type: oppositeType,
        status: "active"
    });

    return candidates
        .map((candidate) => ({
            item: candidate,
            score: matchingScore(item, candidate)
        }))
        .filter((match) => match.score >= MATCH_THRESHOLD);
};

module.exports = {
    MATCH_THRESHOLD,
    matchingScore,
    matchingAlgo
};
