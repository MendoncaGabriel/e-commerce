const Banner = require('../../database/schemas/banner.schema');

exports.getAll = async (pagina, loja_id) => {
    try {
        const banners = await Banner.findAll({
            where: { 
                lojaId: loja_id,
                pagina: pagina
            }
        });

        // Mapeia os resultados para retornar apenas os dataValues
        return banners.map(banner => banner.dataValues);

        
    } catch (error) {
        console.error('Error fetching banners:', error);
        throw new Error('Não foi possível buscar os banners.');
    }
};

