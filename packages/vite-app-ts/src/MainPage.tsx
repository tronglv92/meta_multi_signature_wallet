import '~~/styles/main-page.css';
import { NETWORKS } from '@scaffold-eth/common/src/constants';
import { GenericContract } from 'eth-components/ant/generic-contract';
import { useContractReader, useBalance, useEthersAdaptorFromProviderOrSigners, useEventListener } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { useDexEthPrice } from 'eth-hooks/dapps';
import { asEthersAdaptor } from 'eth-hooks/functions';
import React, { FC, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import { MainPageFooter, MainPageHeader, createPagesAndTabs, TContractPageList } from './components/main';
import { useScaffoldHooksExamples as useScaffoldHooksExamples } from './components/main/hooks/useScaffoldHooksExamples';

import { useAppContracts, useConnectAppContracts, useLoadAppContracts } from '~~/components/contractContext';
import { useCreateAntNotificationHolder } from '~~/components/main/hooks/useAntNotification';
import { useBurnerFallback } from '~~/components/main/hooks/useBurnerFallback';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { BURNER_FALLBACK_ENABLED, DEBUG, MAINNET_PROVIDER } from '~~/config/app.config';
import { FrontPage } from './components/pages/fontPage/FrontPage';
import { Owners } from './components/pages/Owners';
import { CreateTransaction } from './components/pages/CreateTransaction';
import { TransactionTest } from './components/pages/Transactions';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { Streams } from './components/pages/Streams';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * See config/app.config.ts for configuration, such as TARGET_NETWORK
 * See appContracts.config.ts and externalContracts.config.ts to configure your contracts
 * See pageList variable below to configure your pages
 * See web3Modal.config.ts to configure the web3 modal
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * For more
 */

/**
 * The main component
 * @returns
 */
export const MainPage: FC = () => {
  const notificationHolder = useCreateAntNotificationHolder();
  // -----------------------------
  // Providers, signers & wallets
  // -----------------------------
  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const scaffoldAppProviders = useScaffoldAppProviders();

  // 🦊 Get your web3 ethers context from current providers
  const ethersAppContext = useEthersAppContext();

  // if no user is found use a burner wallet on localhost as fallback if enabled
  useBurnerFallback(scaffoldAppProviders, BURNER_FALLBACK_ENABLED);

  // -----------------------------
  // Load Contracts
  // -----------------------------
  // 🛻 load contracts
  useLoadAppContracts();
  // 🏭 connect to contracts for mainnet network & signer
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(MAINNET_PROVIDER);
  useConnectAppContracts(mainnetAdaptor);
  // 🏭 connec to  contracts for current network & signer
  useConnectAppContracts(asEthersAdaptor(ethersAppContext));

  // -----------------------------
  // Hooks use and examples
  // -----------------------------
  // 🎉 Console logs & More hook examples:
  // 🚦 disable this hook to stop console logs
  // 🏹🏹🏹 go here to see how to use hooks!
  useScaffoldHooksExamples(scaffoldAppProviders);

  // -----------------------------
  // These are the contracts!
  // -----------------------------

  // init contracts
  const metaMultiSigWallet = useAppContracts('MetaMultiSigWallet', ethersAppContext.chainId);

  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);

  const [signaturesRequired] = useContractReader(metaMultiSigWallet, metaMultiSigWallet?.signaturesRequired);

  // keep track of a variable from the contract in the local React state:
  const [nonce] = useContractReader(metaMultiSigWallet, metaMultiSigWallet?.nonce);
  // if (DEBUG) console.log('# nonce:', nonce);

  const poolServerUrl = 'http://localhost:49832/';
  const accountAddress = ethersAppContext.account;

  const signer = ethersAppContext.signer;
  const settingsContext = useContext(EthComponentsSettingsContext);
  const tx = transactor(settingsContext, signer, undefined, undefined, true);
  // console.log('metaMultiSigWallet ', metaMultiSigWallet);
  // console.log('signaturesRequired ', signaturesRequired);
  // console.log('mainnetDai ', mainnetDai);

  // // keep track of a variable from the contract in the local React state:
  // const [purpose, update] = useContractReader(
  //   yourContract,
  //   yourContract?.purpose,
  //   [],
  //   yourContract?.filters.SetPurpose()
  // );

  // // 📟 Listen for broadcast events
  const [executeTransactionEvents] = useEventListener(metaMultiSigWallet, 'ExecuteTransaction', 0);
  const [ownerEvents] = useEventListener(metaMultiSigWallet, 'Owner', 1);
  const [withdrawStreamEvents] = useEventListener(metaMultiSigWallet, 'Withdraw', 1);
  // console.log('executeTransactionEvents ', executeTransactionEvents);
  // console.log('ownerEvents ', ownerEvents);
  // -----------------------------
  // .... 🎇 End of examples
  // -----------------------------
  // 💵 This hook will get the price of ETH from 🦄 Uniswap:
  const [ethPrice] = useDexEthPrice(scaffoldAppProviders.mainnetAdaptor?.provider, scaffoldAppProviders.targetNetwork);
  // console.log('ethPrice ', ethPrice);
  // 💰 this hook will get your balance
  const [yourCurrentBalance] = useBalance(ethersAppContext.account);

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  // -----------------------------
  // 📃 Page List
  // -----------------------------
  // This is the list of tabs and their contents
  const pageList: TContractPageList = {
    mainPage: {
      name: 'MultiSig',
      content: (
        <FrontPage
          executeTransactionEvents={executeTransactionEvents}
          metaMultiSigWallet={metaMultiSigWallet}
          scaffoldAppProviders={scaffoldAppProviders}
          price={ethPrice}
        />
      ),
    },
    pages: [
      {
        name: 'owners',
        content: (
          <Owners
            metaMultiSigWallet={metaMultiSigWallet}
            scaffoldAppProviders={scaffoldAppProviders}
            signaturesRequired={signaturesRequired}
            ownerEvents={ownerEvents}
          />
        ),
      },
      // {
      //   name: 'streams',
      //   content: (
      //     <Streams
      //       scaffoldAppProviders={scaffoldAppProviders}
      //       metaMultiSigWallet={metaMultiSigWallet}
      //       address={accountAddress}
      //       withdrawStreamEvents={withdrawStreamEvents}
      //       price={ethPrice}
      //       tx={tx}
      //     />
      //   ),
      // },
      {
        name: 'create',
        content: (
          <CreateTransaction
            scaffoldAppProviders={scaffoldAppProviders}
            metaMultiSigWallet={metaMultiSigWallet}
            accountAddress={accountAddress}
            signaturesRequired={signaturesRequired}
            ownerEvents={ownerEvents}
            price={ethPrice}
            poolServerUrl={poolServerUrl}
          />
        ),
      },
      {
        name: 'pool',
        content: (
          <TransactionTest
            scaffoldAppProviders={scaffoldAppProviders}
            metaMultiSigWallet={metaMultiSigWallet}
            address={accountAddress}
            signaturesRequired={signaturesRequired}
            tx={tx}
            price={ethPrice}
            poolServerUrl={poolServerUrl}
            nonce={nonce}
          />
        ),
      },
      {
        name: 'debug',
        content: (
          <GenericContract
            contractName="MetaMultiSigWallet"
            contract={metaMultiSigWallet}
            mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
            blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}
          />
        ),
      },
    ],
  };
  const { tabContents, tabMenu } = createPagesAndTabs(pageList, route, setRoute);

  return (
    <div className="App">
      <MainPageHeader scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />
      {/* Routes should be added between the <Switch> </Switch> as seen below */}
      <BrowserRouter>
        {tabMenu}
        <Switch>
          {tabContents}
          {/* Subgraph also disabled in MainPageMenu, it does not work, see github issue https://github.com/scaffold-eth/scaffold-eth-typescript/issues/48! */}
          {/*
          <Route path="/subgraph">
            <Subgraph subgraphUri={subgraphUri} mainnetProvider={scaffoldAppProviders.mainnetAdaptor?.provider} />
          </Route>
          */}
        </Switch>
      </BrowserRouter>

      <MainPageFooter scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />
      <div style={{ position: 'absolute' }}>{notificationHolder}</div>
    </div>
  );
};
