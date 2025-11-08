const mapDBtoModel = ({
    id,
    title,
    year
}) => ({
    id,
    name: title,
    year
});

module.exports = mapDBtoModel;