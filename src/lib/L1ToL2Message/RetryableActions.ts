import {
  MultiChainConnector,
  SignersAndProviders,
} from '../utils/MultichainConnector'
import { ContractTransaction } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { ArbRetryableTx__factory } from '../abi/factories/ArbRetryableTx__factory'
import { ARB_RETRYABLE_TX_ADDRESS } from '../precompile_addresses'
import { TransactionReceipt } from '@ethersproject/providers'
import { getTxnReceipt } from '../utils/lib'
import { getMessageNumbersFromL1TxnReceipt } from './lib'

export class RetryableActions extends MultiChainConnector {
  constructor(signersAndProviders: SignersAndProviders) {
    super()
    this.initSignersAndProviders(signersAndProviders)
  }

  public redeem(userL2TxnHash: string): Promise<ContractTransaction> {
    if (!this.l2Signer) throw new Error('Missing required L2 signer')

    const arbRetryableTx = ArbRetryableTx__factory.connect(
      ARB_RETRYABLE_TX_ADDRESS,
      this.l2Signer
    )
    return arbRetryableTx.redeem(userL2TxnHash)
  }
  public cancel(userL2TxnHash: string): Promise<ContractTransaction> {
    if (!this.l2Signer) throw new Error('Missing required L2 signer')

    const arbRetryableTx = ArbRetryableTx__factory.connect(
      ARB_RETRYABLE_TX_ADDRESS,
      this.l2Signer
    )
    return arbRetryableTx.cancel(userL2TxnHash)
  }

  public getTimeout(userL2TxnHash: string): Promise<BigNumber> {
    if (!this.l2Provider) throw new Error('Missing required L2 Provider')

    const arbRetryableTx = ArbRetryableTx__factory.connect(
      ARB_RETRYABLE_TX_ADDRESS,
      this.l2Provider
    )
    return arbRetryableTx.getTimeout(userL2TxnHash)
  }
  public getBeneficiary(userL2TxnHash: string): Promise<string> {
    if (!this.l2Provider) throw new Error('Missing required L2 Provider')

    const arbRetryableTx = ArbRetryableTx__factory.connect(
      ARB_RETRYABLE_TX_ADDRESS,
      this.l2Provider
    )
    return arbRetryableTx.getBeneficiary(userL2TxnHash)
  }

  public async getMessageNumbersFromL1Txn(
    l1TxnHashOrReceipt: string | TransactionReceipt
  ): Promise<BigNumber[]> {
    const txnReceipt = await getTxnReceipt(l1TxnHashOrReceipt, this.l1Provider)
    return getMessageNumbersFromL1TxnReceipt(txnReceipt)
  }
}
