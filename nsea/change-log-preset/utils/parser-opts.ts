export default {
    headerPattern: /^\[([^[]+)\]\[(.*)\](\w*):(.+)$/,
    headerCorrespondence: ['scope', 'subproject', 'type', 'message'],
    noteKeywords: ['BREAKING CHANGE'],
    revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash']
};
