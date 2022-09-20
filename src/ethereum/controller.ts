import {EthService} from './service';
import {EtherServiceServerResponse} from "./controller.types";

export async function getChangedAddress(): Promise<EtherServiceServerResponse> {
    const ethService = new EthService();
    const address = await ethService.getChangedAddress()
    if (address.address && address.sum) {
        return { result: address, error: '' }
    } else {
        return { result: {}, error: 'Dont have enough blocks to calculate' }
    }
}