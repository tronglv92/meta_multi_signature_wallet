import { Result } from '@ethersproject/abi';
import { Button, Input, List, Select, Spin } from 'antd';
const { Option } = Select;
import { Address, AddressInput } from 'eth-components/ant';
import { TypedEvent } from 'eth-hooks/models';
import { BigNumber } from 'ethers';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MetaMultiSigWallet } from '~~/generated/contract-types';
import { useLocalStorage } from '../common/hooks';
import { IScaffoldAppProviders } from '../main/hooks/useScaffoldAppProviders';
export interface IOwnersProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  metaMultiSigWallet: MetaMultiSigWallet | undefined;
  signaturesRequired: BigNumber | undefined;
  ownerEvents: TypedEvent<Result>[];
}
export const Owners: FC<IOwnersProps> = (props) => {
  const { scaffoldAppProviders, metaMultiSigWallet, signaturesRequired, ownerEvents } = props;
  const history = useHistory();
  const ttl = 360;
  const [to, setTo] = useLocalStorage('to', '0x00', ttl);
  const [amount, setAmount] = useLocalStorage('amount', 0, ttl);
  const [methodName, setMethodName] = useLocalStorage('addSigner', 'addSigner', ttl);
  const [newOwner, setNewOwner] = useLocalStorage('newOwner', '', ttl);
  const [newSignaturesRequired, setNewSignaturesRequired] = useLocalStorage('newSignaturesRequired', '', ttl);
  const [data, setData] = useLocalStorage('data', '0x', ttl);
  // const [to, setTo] = useState<string>();
  // const [amount, setAmount] = useState(0);
  // const [methodName, setMethodName] = useState<string>('addSigner');
  // const [newOwner, setNewOwner] = useState<string>('');
  // const [newSignaturesRequired, setNewSignaturesRequired] = useState<string>('');
  // const [data, setData] = useState<string>();
  return (
    <>
      <div>
        <h2 style={{ marginTop: 32 }}>
          Signatures Required: {signaturesRequired ? signaturesRequired.toNumber() : <Spin></Spin>}
        </h2>
        <List
          style={{ maxWidth: 400, margin: 'auto', marginTop: 32 }}
          bordered
          dataSource={ownerEvents}
          renderItem={(item, index) => {
            return (
              <List.Item key={'owner_' + item.args[0] + index}>
                <Address
                  address={item.args[0]}
                  ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
                  blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}
                  fontSize={32}
                />
                <div style={{ padding: 16 }}>{item.args[1] ? '👍' : '👎'}</div>
              </List.Item>
            );
          }}
        />
        <div style={{ border: '1px solid #cccccc', padding: 16, width: 400, margin: 'auto', marginTop: 64 }}>
          <div style={{ margin: 8, padding: 8 }}>
            <Select value={methodName} style={{ width: '100%' }} onChange={setMethodName}>
              <Option key="transferFund">transferFund()</Option>
              <Option key="addSigner">addSigner()</Option>
              <Option key="removeSigner">removeSigner()</Option>
            </Select>
          </div>
          <div style={{ margin: 8, padding: 8 }}>
            <AddressInput
              autoFocus
              ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
              placeholder="new owner address"
              address={newOwner}
              onChange={setNewOwner}
            />
          </div>
          <div style={{ margin: 8, padding: 8 }}>
            <Input
              placeholder="new # of signatures required"
              value={newSignaturesRequired}
              onChange={(e) => {
                setNewSignaturesRequired(e.target.value);
              }}
            />
          </div>
          <div style={{ margin: 8, padding: 8 }}>
            <Button
              onClick={() => {
                // console.log('METHOD', setMethodName);

                if (metaMultiSigWallet) {
                  //   let test = methodName;
                  let calldata;
                  if (methodName == 'addSigner') {
                    calldata = metaMultiSigWallet.interface.encodeFunctionData(methodName, [
                      newOwner,
                      newSignaturesRequired,
                    ]);
                  } else if (methodName == 'removeSigner') {
                    calldata = metaMultiSigWallet.interface.encodeFunctionData(methodName, [
                      newOwner,
                      newSignaturesRequired,
                    ]);
                  } else if (methodName == 'transferFund') {
                    calldata = metaMultiSigWallet.interface.encodeFunctionData(methodName, [newOwner]);
                  }
                  console.log('methodName-newOwner-newSignaturesRequired', methodName, newOwner, newSignaturesRequired);
                  console.log('calldata', calldata);
                  setData(calldata);
                  setAmount(0);
                  setTo(metaMultiSigWallet.address);
                  setTimeout(() => {
                    history.push('/create');
                  }, 777);
                }
              }}>
              Create Tx
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
