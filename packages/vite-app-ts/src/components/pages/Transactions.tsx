import { parseEther } from '@ethersproject/units';
import { Button, List, Spin } from 'antd';
import axios from 'axios';
import { TTransactorFunc } from 'eth-components/functions';
import { BigNumber, ethers } from 'ethers';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { DEBUG } from '~~/config/app.config';
import { MetaMultiSigWallet } from '~~/generated/contract-types';

import { usePoller } from '~~/helpers/poller';
import { IScaffoldAppProviders } from '../main/hooks/useScaffoldAppProviders';
import { TransactionListItem } from './fontPage/TransactionListItem';
export interface ITransactionProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  metaMultiSigWallet: MetaMultiSigWallet | undefined;
  signaturesRequired: BigNumber | undefined;

  price: number;
  poolServerUrl: string;
  address: string | undefined;
  tx: TTransactorFunc | undefined;
  nonce: BigNumber | undefined;
}

export const TransactionTest: FC<ITransactionProps> = (props) => {
  const { metaMultiSigWallet, scaffoldAppProviders, poolServerUrl, nonce, signaturesRequired, price, address, tx } =
    props;
  const [transactions, setTransactions] = useState<any[]>([]);

  usePoller(() => {
    const getTransactions = async () => {
      if (DEBUG) console.log('🛰 Requesting Transaction List');
      const res = await axios.get(
        poolServerUrl + metaMultiSigWallet?.address + '_' + scaffoldAppProviders.targetNetwork.chainId
      );
      // console.log(
      //   'params ',
      //   poolServerUrl + metaMultiSigWallet?.address + '_' + scaffoldAppProviders.targetNetwork.chainId
      // );
      // console.log('res ', res);
      const newTransactions = [];
      for (const i in res.data) {
        // console.log('look through signatures of ', res.data[i]);
        const thisNonce = ethers.BigNumber.from(res.data[i].nonce);
        // console.log('thisNonce ', thisNonce.toString());
        // console.log('nonce ', nonce?.toString());
        if (thisNonce && nonce && thisNonce.gte(nonce)) {
          const validSignatures = [];
          for (const s in res.data[i].signatures) {
            // console.log('RECOVER:', res.data[i].signatures[s], res.data[i].hash);
            const signer = await metaMultiSigWallet?.recover(res.data[i].hash, res.data[i].signatures[s]);
            if (signer) {
              const isOwner = await metaMultiSigWallet?.isOwner(signer);
              if (isOwner) {
                validSignatures.push({ signer, signature: res.data[i].signatures[s] });
              }
            }
          }
          const update = { ...res.data[i], validSignatures };
          // console.log('update', update);
          newTransactions.push(update);
        }
      }
      setTransactions(newTransactions);
      console.log('Loaded', newTransactions.length);
    };
    if (metaMultiSigWallet) getTransactions();
  }, 3777);

  const getSortedSigList = async (allSigs: string[], newHash: string) => {
    console.log('allSigs', allSigs);
    const sigList: any[] = [];
    for (const s in allSigs) {
      // console.log('SIG', allSigs[s]);
      const recover = await metaMultiSigWallet?.recover(newHash, allSigs[s]);
      sigList.push({ signature: allSigs[s], signer: recover });
    }
    console.log('SORTED SIG LIST:', sigList);
    sigList.sort((a: any, b: any) => {
      console.log('a ', a);
      if (ethers.BigNumber.from(a.signer) == ethers.BigNumber.from(b.signer)) {
        return 0;
      } else if (ethers.BigNumber.from(a.signer) > ethers.BigNumber.from(b.signer)) {
        return -1;
      }
      return 1;
      // return ethers.BigNumber.from(a.signer).sub(ethers.BigNumber.from(b.signer)).toNumber();
    });
    // console.log('SORTED SIG LIST:', sigList);
    const finalSigList = [];
    const finalSigners = [];
    const used: any = {};
    for (const s in sigList) {
      if (!used[sigList[s].signature]) {
        finalSigList.push(sigList[s].signature);
        finalSigners.push(sigList[s].signer);
      }
      used[sigList[s].signature] = true;
    }
    // console.log('FINAL SIG LIST:', finalSigList);
    // console.log('FINAL SIGNER:', finalSigners);
    return [finalSigList, finalSigners];
  };
  if (!signaturesRequired) {
    return <Spin />;
  }
  // console.log('transactions', transactions);
  return (
    <>
      <div style={{ maxWidth: 750, margin: 'auto', marginTop: 32, marginBottom: 32 }}>
        <h1>
          <b style={{ padding: 16 }}>#{nonce ? nonce.toNumber() : <Spin />}</b>
        </h1>

        <List
          bordered
          dataSource={transactions}
          renderItem={(item) => {
            // console.log('ITE88888M', item);

            const hasSigned = item.signers.indexOf(address) >= 0;
            const hasEnoughSignatures = item.signatures.length <= signaturesRequired.toNumber();

            return (
              <TransactionListItem
                item={item}
                price={price}
                metaMultiSigWallet={metaMultiSigWallet}
                scaffoldAppProviders={scaffoldAppProviders}>
                <span>
                  {item.signatures.length}/{signaturesRequired.toNumber()} {hasSigned ? '✅' : ''}
                </span>
                <Button
                  onClick={async () => {
                    console.log('item.signatures', item.signatures);
                    if (metaMultiSigWallet) {
                      const newHash = await metaMultiSigWallet.getTransactionHash(
                        item.nonce,
                        item.to,
                        parseEther('' + parseFloat(item.amount).toFixed(12)),
                        item.data
                      );
                      console.log('newHash', newHash);

                      const signature = await scaffoldAppProviders.currentProvider?.send('personal_sign', [
                        newHash,
                        address,
                      ]);
                      console.log('signature', signature);

                      const recover = await metaMultiSigWallet?.recover(newHash, signature);
                      console.log('recover--->', recover);

                      const isOwner = await metaMultiSigWallet?.isOwner(recover);
                      console.log('isOwner', isOwner);

                      if (isOwner) {
                        const [finalSigList, finalSigners] = await getSortedSigList(
                          [...item.signatures, signature],
                          newHash
                        );
                        const res = await axios.post(poolServerUrl, {
                          ...item,
                          signatures: finalSigList,
                          signers: finalSigners,
                        });
                      }
                    }

                    // tx( writeContracts[contractName].executeTransaction(item.to,parseEther(""+parseFloat(item.amount).toFixed(12)), item.data, item.signatures))
                  }}
                  type="ghost">
                  Sign
                </Button>
                <Button
                  key={item.hash}
                  onClick={async () => {
                    if (metaMultiSigWallet) {
                      const newHash = await metaMultiSigWallet?.getTransactionHash(
                        item.nonce,
                        item.to,
                        parseEther('' + parseFloat(item.amount).toFixed(12)),
                        item.data
                      );
                      console.log('newHash', newHash);

                      console.log('item.signatures', item.signatures);

                      const [finalSigList, finalSigners] = await getSortedSigList(item.signatures, newHash);
                      console.log('item.to ', item.to);
                      console.log(
                        "parseEther('' + parseFloat(item.amount).toFixed(12)) ",
                        parseEther('' + parseFloat(item.amount).toFixed(12))
                      );
                      console.log('item.data ', item.data);
                      console.log('finalSigList ', finalSigList);
                      if (tx) {
                        tx(
                          metaMultiSigWallet?.executeTransaction(
                            item.to,
                            parseEther('' + parseFloat(item.amount).toFixed(12)),
                            item.data,
                            finalSigList
                          )
                        );
                      }
                    }
                  }}
                  type={hasEnoughSignatures ? 'primary' : 'ghost'}>
                  Exec
                </Button>
              </TransactionListItem>
            );
          }}
        />
      </div>
    </>
  );
};
