import { Result } from '@ethersproject/abi';
import { formatEther, parseEther } from '@ethersproject/units';
import { Button, Input, List, Select, Spin } from 'antd';
import axios from 'axios';
const { Option } = Select;
import { Address, AddressInput, Balance, Blockie, EtherInput } from 'eth-components/ant';
import { useContractReader } from 'eth-hooks';
import { TypedEvent } from 'eth-hooks/models';
import { BigNumber } from 'ethers';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MetaMultiSigWallet } from '~~/generated/contract-types';
import { useLocalStorage } from '../common/hooks';
import { IScaffoldAppProviders } from '../main/hooks/useScaffoldAppProviders';
export interface ICreateTransactionProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  metaMultiSigWallet: MetaMultiSigWallet | undefined;
  signaturesRequired: BigNumber | undefined;
  ownerEvents: TypedEvent<Result>[];
  price: number;
  poolServerUrl: string;
  accountAddress: string | undefined;
}
export const CreateTransaction: FC<ICreateTransactionProps> = (props) => {
  const { scaffoldAppProviders, metaMultiSigWallet, price, poolServerUrl, accountAddress } = props;
  const inputStyle = {
    padding: 10,
  };
  // keep track of a variable from the contract in the local React state:
  const [nonce] = useContractReader(metaMultiSigWallet, metaMultiSigWallet?.nonce);
  //   const calldataInputRef = useRef('0x');

  // console.log('🤗 nonce:', nonce);

  // console.log('price', price);

  const [customNonce, setCustomNonce] = useState<BigNumber>();
  const [to, setTo] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [data, setData] = useState<string>('0x');
  const [isCreateTxnEnabled, setCreateTxnEnabled] = useState(true);
  const [decodedDataState, setDecodedData] = useState<any>();
  const [methodName, setMethodName] = useState<string>();
  const [selectDisabled, setSelectDisabled] = useState<boolean>(false);

  const [result, setResult] = useState<string>();
  const history = useHistory();

  let resultDisplay;
  if (result) {
    if (result.indexOf('ERROR') >= 0) {
      resultDisplay = <div style={{ margin: 16, padding: 8, color: 'red' }}>{result}</div>;
    } else {
      resultDisplay = (
        <div style={{ margin: 16, padding: 8 }}>
          <Blockie scale={8} address={result} /> Tx {result.substr(0, 6)} Created!
          <div style={{ margin: 8, padding: 4 }}>
            <Spin />
          </div>
        </div>
      );
    }
  }
  let decodedDataObject: any;

  let decodedData = <></>;
  if (data && data != '0x') {
    try {
      let decodedDataObject = metaMultiSigWallet ? metaMultiSigWallet.interface.parseTransaction({ data: data }) : null;

      let argDisplay = [];
      for (let a = 0; decodedDataObject && a < decodedDataObject.args.length; a++) {
        let thisValue = decodedDataObject.args[a];
        if (thisValue) {
          if (thisValue._isBigNumber) {
            try {
              thisValue = thisValue.toNumber();
            } catch (e) {
              thisValue = formatEther(thisValue);
            }
          }
          argDisplay.push(<div key={'args_' + a}>{thisValue}</div>);
        }
      }
      decodedData = (
        <div>
          <div style={{ marginTop: 16, marginBottom: 16 }}>{decodedDataObject?.signature}</div>
          {argDisplay}
        </div>
      );
    } catch (err) {}
  }
  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: '1px solid #cccccc', padding: 16, width: 400, margin: 'auto', marginTop: 64 }}>
        <div style={{ margin: 8 }}>
          <div style={inputStyle}>
            <Input
              prefix="#"
              disabled
              value={customNonce?.toString()}
              placeholder={'' + (nonce ? nonce.toNumber() : 'loading...')}
              onChange={(event) => {
                setCustomNonce(BigNumber.from(event.target.value));
              }}
            />
          </div>
          {/* <div style={{ margin: 8, padding: 8 }}>
            <Select value={methodName} disabled={selectDisabled} style={{ width: '100%' }} onChange={setMethodName}>
              <Option key="transferFunds">transferFunds()</Option>
              <Option disabled={true} key="addSigner">
                addSigner()
              </Option>
              <Option disabled={true} key="removeSigner">
                removeSigner()
              </Option>
            </Select>
          </div> */}
          <div style={inputStyle}>
            <AddressInput
              autoFocus
              ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
              placeholder="to address"
              address={to}
              onChange={setTo}
            />
          </div>

          <div style={inputStyle}>
            <EtherInput price={price} value={amount} onChange={setAmount} />
          </div>
          <div style={inputStyle}>
            <Input
              placeholder="calldata"
              value={data}
              onChange={(e) => {
                setData(e.target.value);
              }}
              //   ref={calldataInputRef}
            />
            {decodedData}
          </div>

          <Button
            style={{ marginTop: 32 }}
            disabled={!isCreateTxnEnabled}
            onClick={async () => {
              // setData(calldataInputRef.current.state.value)
              // if (data && data == "0x") {
              //   setResult("ERROR, Call Data Invalid");
              //   return;
              // }
              if (metaMultiSigWallet) {
                console.log('customNonce', customNonce);
                const nonce = customNonce || (await metaMultiSigWallet.nonce());
                console.log('nonce', nonce);

                const newHash = await metaMultiSigWallet.getTransactionHash(
                  nonce,
                  to,
                  parseEther('' + parseFloat(amount).toFixed(12)),
                  data
                );
                console.log('newHash', newHash);
                console.log('accountAddress', accountAddress);
                const signature = await scaffoldAppProviders.currentProvider?.send('personal_sign', [
                  newHash,
                  accountAddress,
                ]);
                console.log('signature', signature);

                const recover = await metaMultiSigWallet.recover(newHash, signature);
                console.log('recover', recover);

                const isOwner = await metaMultiSigWallet.isOwner(recover);
                console.log('isOwner', isOwner);

                if (isOwner) {
                  const res = await axios.post(poolServerUrl, {
                    chainId: scaffoldAppProviders.targetNetwork.chainId,
                    address: metaMultiSigWallet.address,
                    nonce: nonce.toNumber(),
                    to: to,
                    amount,
                    data,
                    hash: newHash,
                    signatures: [signature],
                    signers: [recover],
                  });
                  // IF SIG IS VALUE ETC END TO SERVER AND SERVER VERIFIES SIG IS RIGHT AND IS SIGNER BEFORE ADDING TY

                  console.log('RESULT', res.data);

                  setTimeout(() => {
                    history.push('/pool');
                  }, 2777);

                  setResult(res.data.hash);
                  //   setTo();
                  setAmount('0');
                  setData('0x');
                } else {
                  console.log('ERROR, NOT OWNER.');
                  setResult('ERROR, NOT OWNER.');
                }
              }
            }}>
            Create
          </Button>
        </div>

        {resultDisplay}
      </div>
    </div>
  );
};
