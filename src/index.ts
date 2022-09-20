import Fastify, { FastifyInstance } from 'fastify';
import {EthService} from "./ethereum/service";
import {dbConnect} from "./database";
import {getChangedAddress} from "./ethereum/controller";

const ethService = new EthService();

const server: FastifyInstance = Fastify({
    logger: true,
})

server.get('/changedAddress', getChangedAddress)

const main = async () => {
    try {

        await dbConnect.sync();
        await ethService.run();

        await server.listen({ port: 8080, host: '0.0.0.0' })

    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

main()

