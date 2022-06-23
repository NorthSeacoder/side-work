module.exports = {
    parserOpts: {
        headerPattern: /^\[([^[]+)\]\[(.*)\] (\w*):(.+)$/,
        headerCorrespondence: ['scope', 'subject', 'type', 'message']
    }
};
