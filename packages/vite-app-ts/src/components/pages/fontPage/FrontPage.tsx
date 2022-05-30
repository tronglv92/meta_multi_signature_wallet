import { Address, Balance } from 'eth-components/ant';
import { FC } from 'react';
import { useLocalStorage } from '../../common/hooks';
import { IScaffoldAppProviders } from '../../main/hooks/useScaffoldAppProviders';
import QRCode from 'qrcode.react';
import { List } from 'antd';
import { MetaMultiSigWallet } from '~~/generated/contract-types';
import { TypedEvent } from 'eth-hooks/models';
import { Result } from '@ethersproject/abi';
import { TransactionListItem } from './TransactionListItem';

export interface IFrontPageProps {
  executeTransactionEvents: TypedEvent<Result>[];

  scaffoldAppProviders: IScaffoldAppProviders;
  metaMultiSigWallet: MetaMultiSigWallet | undefined;
  price: number;
}
export const FrontPage: FC<IFrontPageProps> = (props) => {
  const { scaffoldAppProviders, price, metaMultiSigWallet, executeTransactionEvents } = props;

  return (
    <>
      <div style={{ padding: 32, maxWidth: 750, margin: 'auto' }}>
        <div style={{ paddingBottom: 32 }}>
          <div>
            <Balance address={metaMultiSigWallet?.address} dollarMultiplier={price} fontSize={64} />
          </div>
          <div>
            <QRCode
              value={metaMultiSigWallet?.address ?? ''}
              size={180}
              level="H"
              includeMargin
              renderAs="svg"
              //   imageSettings={{ excavate: false }}
            />
          </div>
          <div>
            <Address
              address={metaMultiSigWallet?.address}
              ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
              blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}
              fontSize={32}
            />
          </div>
        </div>
        <List
          bordered
          dataSource={executeTransactionEvents}
          renderItem={(item) => {
            const itemConvert = {
              nonce: item.args[4],
              hash: item.args[5],
              to: item.args[1],
              value: item.args[2],
              amount: item.args[4],
              data: item.args[3],
            };
            return (
              <>
                <TransactionListItem
                  item={itemConvert}
                  scaffoldAppProviders={scaffoldAppProviders}
                  price={price}
                  metaMultiSigWallet={metaMultiSigWallet}
                />
              </>
            );
          }}
        />
      </div>
    </>
  );
};
