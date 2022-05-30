import { EllipsisOutlined } from '@ant-design/icons';
import { Result } from '@ethersproject/abi';
import { parseEther } from '@ethersproject/units';
import { Button, List } from 'antd';
import { Address, Balance, Blockie } from 'eth-components/ant';
import { TypedEvent } from 'eth-hooks/models';
import { FC, useState } from 'react';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { MetaMultiSigWallet } from '~~/generated/contract-types';
import TransactionDetailsModal from './TransactionDetailsModal';
export interface ITransactionListItemProps {
  item: any;
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
  metaMultiSigWallet: MetaMultiSigWallet | undefined;
  children?: any;
}
export const TransactionListItem: FC<ITransactionListItemProps> = (props) => {
  // item is event
  const { item, scaffoldAppProviders, price, metaMultiSigWallet, children } = props;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  let txnData;
  if (metaMultiSigWallet) {
    // console.log('item ', item);
    try {
      // txnData = metaMultiSigWallet.interface.parseTransaction({ data: item.args[3] });
      txnData = metaMultiSigWallet.interface.parseTransaction({ data: item.data });
    } catch (error) {
      console.log('ERROR', error);
    }
  }
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };
  // console.log('item ', item);
  return (
    <>
      <TransactionDetailsModal
        visible={isModalVisible}
        txnInfo={txnData}
        handleOk={handleOk}
        scaffoldAppProviders={scaffoldAppProviders}
        price={price}
      />
      {txnData && (
        <List.Item style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 55,
              fontSize: 12,
              opacity: 0.5,
              display: 'flex',
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'space-between',
            }}>
            <p>
              <b>Event Name :&nbsp;</b>
              {txnData.functionFragment.name}&nbsp;
            </p>
            <p>
              <b>Addressed to :&nbsp;</b>
              {txnData.args[0]}
            </p>
          </div>
          {/*  event ExecuteTransaction(address indexed owner, address payable to, uint256 value, bytes data, uint256 nonce, bytes32 hashString, bytes result); */}
          {/* {<b style={{ padding: 16 }}>#{typeof item.args[4] === 'number' ? item.args[4] : item.args[4].toNumber()}</b>}
          <span>
            <Blockie scale={8} address={item.args[5]} /> {item.args[5].substr(0, 6)}
          </span>
          <Address
            address={item.args[1]}
            ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
            blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}
            fontSize={16}
          />
          <Balance
            balance={item.args[2] ? item.args[2] : parseEther('' + parseFloat(item.args[4]).toFixed(12))}
            address={''}
            dollarMultiplier={price}
          /> */}
          {<b style={{ padding: 16 }}>#{typeof item.nonce === 'number' ? item.nonce : item.nonce.toNumber()}</b>}
          <span>
            <Blockie scale={8} address={item.hash} /> {item.hash.substr(0, 6)}
          </span>

          <Address
            address={item.to}
            ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
            blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}
            fontSize={16}
          />
          <Balance
            balance={item.value ? item.value : parseEther('' + parseFloat(item.amount).toFixed(12))}
            address={''}
            dollarMultiplier={price}
          />

          <>{children}</>
          <Button onClick={showModal}>
            <EllipsisOutlined />
          </Button>
        </List.Item>
      )}
    </>
  );
};
