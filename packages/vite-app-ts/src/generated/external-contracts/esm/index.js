import { Contract } from 'ethers';
import mainnetDAIAbi from '../../abis/mainnet/DAI.json';
export function getContract(address, abi, defaultSigner) {
    return new Contract(address, abi, defaultSigner);
}
export function getMainnetSdk(defaultSigner) {
    return {
        "DAI": getContract('0x6b175474e89094c44da98b954eedeac495271d0f', mainnetDAIAbi, defaultSigner),
    };
}
