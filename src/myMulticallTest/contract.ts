import { ContractCallContext } from 'ethereum-multicall'

const contractCallContext: ContractCallContext = {
  reference: 'upV2Controller',
  contractAddress: '0x19891DdF6F393C02E484D7a942d4BF8C0dB1d001',
  abi: [
    {
      inputs: [],
      name: 'getVirtualPrice',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'sentValue',
          type: 'uint256'
        }
      ],
      name: 'getVirtualPrice',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    }
  ],
  calls: [
    {
      reference: 'getVirtualPriceWithInput',
      methodName: 'getVirtualPrice(uint256)',
      methodParameters: ['0xFFFFFFFFFFFFF']
    },
    {
      reference: 'getVirtualPriceWithoutInput',
      methodName: 'getVirtualPrice()',
      methodParameters: []
    }
  ]
}
export default contractCallContext
