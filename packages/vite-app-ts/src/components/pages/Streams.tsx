import { formatEther, parseEther } from '@ethersproject/units';
import { Button, Input, InputNumber, List, notification, Select, Spin } from 'antd';
import axios from 'axios';
import { Address, AddressInput, Balance, EtherInput } from 'eth-components/ant';
import { TTransactorFunc } from 'eth-components/functions';
import { useBalance } from 'eth-hooks';
import { BigNumber, ethers } from 'ethers';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DEBUG } from '~~/config/app.config';
import { MetaMultiSigWallet } from '~~/generated';
import { usePoller } from '~~/helpers/poller';
import { IScaffoldAppProviders } from '../main/hooks/useScaffoldAppProviders';
import { TransactionListItem } from './fontPage/TransactionListItem';
const { Option } = Select;
export interface IStreamsProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  metaMultiSigWallet: MetaMultiSigWallet | undefined;
 
  withdrawStreamEvents: any[];
  price: number;

  address: string | undefined;
  tx: TTransactorFunc | undefined;
}

export const Streams: FC<IStreamsProps> = (props) => {
  const { scaffoldAppProviders, price, address, tx, metaMultiSigWallet, withdrawStreamEvents } = props;
  const [streams, setStreams] = useState<string[]>();
  const [streamInfo, setStreamInfo] = useState<any>();
  const [streamReason, setStreamReason] = useState<string>();
  const [streamReasonUp, setStreamReasonUp] = useState<boolean>();
  const [customStreamAmount, setCustomStreamAmount] = useState<string>();
  const [methodName, setMethodName] = useState<string>();
  const walletBalance = useBalance(metaMultiSigWallet?.address);
  const [streamToAddress, setStreamToAddress] = useState<string>('');
  const [streamAmount, setStreamAmount] = useState<string>('0');
  const [streamFrequency, setStreamFrequency] = useState<number>();
  const [data, setData] = useState<string>();
  const [amount, setAmount] = useState<string>('0');
  const [to, setTo] = useState<string>();
  const history = useHistory();

  let streamDetailForm = <></>;
  let extraDisplay = '';

  if (streamFrequency && streamFrequency > 0) {
    if (streamFrequency > 86400) {
      extraDisplay = '(' + (streamFrequency / 86400).toFixed(2) + ' days)';
    } else if (streamFrequency > 3600) {
      extraDisplay = '(' + (streamFrequency / 3600).toFixed(2) + ' hours)';
    } else if (streamFrequency > 60) {
      extraDisplay = '(' + (streamFrequency / 60).toFixed(2) + ' minutes)';
    }
  }

  if (methodName == 'openStream') {
    streamDetailForm = (
      <div>
        <div style={{ margin: 8, padding: 8 }}>
          <EtherInput price={price} placeholder="amount" value={streamAmount} onChange={setStreamAmount} />
        </div>
        <div style={{ margin: 8, padding: 8 }}>
          every{' '}
          <InputNumber
            style={{ width: 180 }}
            placeholder="frequency"
            value={streamFrequency}
            onChange={setStreamFrequency}
          />{' '}
          seconds <div style={{ opacity: 0.5, padding: 4 }}>{extraDisplay}</div>
        </div>
      </div>
    );
  }
  let withdrawalDisplay = <></>;
  let index = 0;
  if (withdrawStreamEvents) {
    withdrawalDisplay = (
      <div style={{ border: '1px solid #cccccc', padding: 16, width: 550, margin: 'auto', marginTop: 64 }}>
        <b>Withdrawals:</b>
        <List
          dataSource={withdrawStreamEvents}
          renderItem={(item) => {
            return (
              <List.Item key={'withdrawal_' + index++}>
                <div>
                  <Address
                    address={item.to}
                    ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
                    fontSize={16}
                  />
                  <Balance balance={item.amount} dollarMultiplier={price} address="" />
                </div>
                {item.reason}
              </List.Item>
            );
          }}
        />
      </div>
    );
  }
  return (
    <>
      <div>
        <List
          style={{ maxWidth: 550, margin: 'auto', marginTop: 32 }}
          bordered
          dataSource={streams}
          renderItem={(item) => {
            if (!streamInfo) return '...';

            let withdrawButtonOrBalance = null;

            let prettyBalanceDisplay =
              '$' +
              (
                parseFloat(formatEther(streamInfo[item] && streamInfo[item].balance ? streamInfo[item].balance : 0)) *
                price
              ).toFixed(2);
            let currentButtonDisplay = prettyBalanceDisplay;

            let addressDisplay = (
              <Address
                address={item}
                ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
                blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}
                fontSize={32}
              />
            );

            if (streamInfo[item] && !streamInfo[item].balance) {
              withdrawButtonOrBalance = <div style={{ opacity: 0.5 }}>closed</div>;
            } else if (address == item) {
              if (streamReasonUp) {
                addressDisplay = <></>;
                const formStyle = { padding: 8 };

                currentButtonDisplay = 'Withdraw';

                withdrawButtonOrBalance = (
                  <div>
                    <div style={formStyle}>
                      <Input
                        placeholder="withdrawal reason or link to PR/work"
                        value={streamReason}
                        onChange={(e) => {
                          setStreamReason(e.target.value);
                        }}
                      />
                    </div>
                    <div style={formStyle}>
                      <Input
                        placeholder={'amount (leave blank for max: ' + prettyBalanceDisplay + ')'}
                        value={customStreamAmount}
                        onChange={(e) => {
                          setCustomStreamAmount(e.target.value);
                        }}
                      />
                    </div>
                    <div style={formStyle}>
                      <Button
                        style={{ paddingTop: -8 }}
                        type={'primary'}
                        onClick={() => {
                          if (!streamReason) {
                            notification.info({
                              message: 'Error: Provide Reason',
                              description: 'Please provide a reason or url to work.',
                              placement: 'bottomRight',
                            });
                          } else {
                            let amountToWithdraw = streamInfo[item].balance;
                            console.log('amountToWithdraw1', amountToWithdraw);
                            if (customStreamAmount) {
                              let cleaned = parseFloat(customStreamAmount.replace('$', ''));
                              //console.log("cleaned",cleaned)
                              let floatToWithdraw = parseFloat((cleaned / price).toString()).toFixed(8);
                              //console.log("floatToWithdraw",floatToWithdraw)
                              amountToWithdraw = parseEther('' + floatToWithdraw);
                              //console.log("amountToWithdraw2",amountToWithdraw)
                            }

                            if (
                              streamInfo[item] &&
                              streamInfo[item].balance &&
                              streamInfo[item].balance.gt(walletBalance)
                            ) {
                              notification.info({
                                message: 'Warning: Contract Balance',
                                description: "It looks like there isn't enough in the contract to withdraw?",
                                placement: 'bottomRight',
                              });
                            }
                            if (tx) {
                              tx(metaMultiSigWallet?.streamWithdraw(amountToWithdraw, streamReason));
                            }
                            setStreamReason('');
                            setStreamReasonUp(false);
                            setCustomStreamAmount('');
                          }
                        }}>
                        {currentButtonDisplay}
                      </Button>
                    </div>
                  </div>
                );
              } else {
                withdrawButtonOrBalance = (
                  <Button
                    style={{ paddingTop: -8 }}
                    onClick={() => {
                      setStreamReasonUp(true);
                    }}>
                    {'$' +
                      (
                        parseFloat(
                          formatEther(streamInfo[item] && streamInfo[item].balance ? streamInfo[item].balance : 0)
                        ) * price
                      ).toFixed(2)}
                  </Button>
                );
              }
            } else {
              withdrawButtonOrBalance = (
                <Balance
                  balance={streamInfo[item] ? streamInfo[item].balance : 0}
                  dollarMultiplier={price}
                  address=""
                />
              );
            }

            return (
              <List.Item key={'stream_' + item}>
                {addressDisplay}
                {withdrawButtonOrBalance}
              </List.Item>
            );
          }}
        />

        {withdrawalDisplay}

        <div style={{ border: '1px solid #cccccc', padding: 16, width: 400, margin: 'auto', marginTop: 64 }}>
          <div style={{ margin: 8, padding: 8 }}>
            <Select value={methodName} style={{ width: '100%' }} onChange={setMethodName}>
              <Option key="openStream">openStream()</Option>
              <Option key="closeStream">closeStream()</Option>
            </Select>
          </div>
          <div style={{ margin: 8, padding: 8 }}>
            <AddressInput
              autoFocus
              ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
              placeholder="stream to address"
              address={streamToAddress}
              onChange={setStreamToAddress}
            />
          </div>
          {streamDetailForm}
          <div style={{ margin: 8, padding: 8 }}>
            <Button
              onClick={() => {
                //console.log("METHOD",setMethodName)

                let calldata;
                if (methodName == 'openStream') {
                  calldata = metaMultiSigWallet?.interface.encodeFunctionData('openStream', [
                    streamToAddress,
                    parseEther('' + parseFloat(streamAmount).toFixed(12)),
                    BigNumber.from(streamFrequency),
                  ]);
                } else {
                  calldata = metaMultiSigWallet?.interface.encodeFunctionData('closeStream', [streamToAddress]);
                }
                console.log('calldata', calldata);
                setData(calldata);
                setAmount('0');
                setTo(metaMultiSigWallet?.address);
                setTimeout(() => {
                  history.push('/create');
                }, 777);
              }}>
              Create Tx
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
