const ClientError = require("../../exception/clientError");

class LikesHandler{
    constructor(service, cacheService){
        this._service = service;
        this._cacheService = cacheService;

        this.postLikesHandler = this.postLikesHandler.bind(this);
        this.deleteLikesHandler = this.deleteLikesHandler.bind(this);
        this.getLikesHandler = this.getLikesHandler.bind(this);
    }

    async postLikesHandler(request, h){
        const {id: albumId} = request.params;
        const {id: userId} = request.auth.credentials;

        const isLiked = await this._service.sudahLike(albumId, userId);

        if (isLiked){
            throw new ClientError('Sudah dilike sebelumnya', 400);
        }

        await this._service.addLike(albumId, userId);
        this._cacheService.delete(`like:${albumId}`);

        const response = h.response({
            status: 'success',
            message: 'Like berhasil ditambahkan'
        });
        
        response.code(201);
        return response;
    }

    async deleteLikesHandler(request, h){
        const {id: albumId} = request.params;
        const {id: userId} = request.auth.credentials;
        
        const isLiked = await this._service.sudahLike(albumId, userId);
        
        await this._service.deleteLike(albumId, userId);
        this._cacheService.delete(`like:${albumId}`);
        
        return h.response({
            status: 'success',
            message: 'Like berhasil ditambahkan'
        });
    }
    
    async getLikesHandler(request, h){
        const {id: albumId} = request.params;
        try{
            const result = await this._cacheService.get(`like:${albumId}`);
            const response = h.response({
                status: 'success',
                data:{
                    likes: parseInt(result),
                }
            })

            response.header('X-Data-Source', 'cache')

            return response;
        } catch(error){
            const count = await this._service.getLikes(albumId);
            await this._cacheService.set(`like:${albumId}`, count);
            return h.response({
                status: 'success',
                data:{
                    likes: parseInt(count)
                }
            })
        }
    }
}


module.exports = LikesHandler