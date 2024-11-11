"use client";
import type {
  AccountState,
  NetworkId,
  WalletSelector,
} from "@near-wallet-selector/core";
import { setupWalletSelector } from "@near-wallet-selector/core";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupEthereumWallets } from "@aurora-is-near/ethereum-wallets";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import type { ReactNode } from "react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { distinctUntilChanged, map } from "rxjs";
import { createWeb3Modal } from "@web3modal/wagmi";
import {
  reconnect,
  http,
  createConfig,
  type Config,
  createStorage,
  cookieStorage,
} from "@wagmi/core";
import { type Chain } from "@wagmi/core/chains";
import { injected, walletConnect } from "@wagmi/connectors";
import { IS_MAINNET } from "@/constants";
import getWebsiteUrl from "@/utils/getWebsiteUrl";

interface WalletSelectorContextValue {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  account: AccountState | null;
  accounts: Array<AccountState>;
  accountId: string | null;
  loading: boolean;
  isEthereumWallet: boolean;
  activeWalletId: string | null;
}

export const ETHEREUM_WALLETS_CONNECTOR = "ethereum-wallets";
export const MY_NEAR_WALLET_CONNECTOR = "my-near-wallet";
const WalletSelectorContext =
  React.createContext<WalletSelectorContextValue | null>(null);

const projectId = process.env.WC_PROJECT_ID;

const chainId = Number(process.env.chainId);
const near: Chain = {
  id: chainId,
  name: `NEAR Protocol${IS_MAINNET ? "" : " Testnet"}`,
  nativeCurrency: {
    decimals: 18,
    name: "NEAR",
    symbol: "NEAR",
  },
  rpcUrls: {
    default: { http: [process.env.ethRpcForNear] },
    public: { http: [process.env.ethRpcForNear] },
  },
  blockExplorers: {
    default: {
      name: "NEAR Explorer",
      url: process.env.walletExplorerUrl,
    },
  },
  testnet: !IS_MAINNET,
};
const url = getWebsiteUrl();
const metadata = {
  name: "Onboard to NEAR Protocol",
  description: "Discover NEAR Protocol with Ethereum and NEAR wallets.",
  url: getWebsiteUrl(),
  icons: [`${url}/android-chrome-512x512.png`],
};
export const wagmiConfig: Config = createConfig({
  chains: [near],
  transports: {
    [near.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId,
      metadata,
      showQrModal: false,
    }),
    injected({ shimDisconnect: true }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
});
reconnect(wagmiConfig);

const web3Modal = createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  themeMode: "light",
  themeVariables: {
    "--w3m-font-size-master": "9.5px",
    "--w3m-font-family":
      '__monaSans_70dae0, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    // https://docs.walletconnect.com/appkit/react/core/theming#themevariables
  },
  allWallets: "SHOW",
  enableOnramp: false,
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    "163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3", // Brave
    "a9751f17a3292f2d1493927f0555603d69e9a3fcbcdf5626f01b49afa21ced91", // Frame
    "fbc8d86ad914ebd733fec4812b4b7af5ca709fdd9e75a930115e5baa02c4ef4c", // Rabby
    "76260019aec5a3c44dd2421bf78e80f71a6c090d932c413a287193ed79450694", // AP
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust
    "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18", // Zerion
  ],
});

export const WalletSelectorContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: process.env.nearEnv as NetworkId,
      debug: true,
      modules: [
        setupMyNearWallet(),
        setupEthereumWallets({
          wagmiConfig,
          web3Modal,
          alwaysOnboardDuringSignIn: true,
          skipSignInAccessKey: true,
        }),
        setupWalletConnect({
          projectId: projectId,
          metadata,
          methods: [
            "near_signIn",
            "near_signOut",
            "near_getAccounts",
            "near_signTransaction",
            "near_signTransactions",
          ],
        }),
        setupMeteorWallet(),
        setupHereWallet(),
      ],
    });
    // const _modal = setupModal(_selector, { contractId: "" });
    // NOTE: We use an acces key to be compatible with all NEAR wallets,
    // but skip the login access key when possible, for example skipSignInAccessKey with setupEthereumWallets.
    const _modal = setupModal(_selector, {
      contractId: IS_MAINNET ? "welcome-to.near" : "welcome-to-near.testnet",
    });
    const state = _selector.store.getState();
    setAccounts(state.accounts);
    setSelector(_selector);
    setModal(_modal);
    setLoading(false);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log("Accounts Update", nextAccounts);

        setAccounts(nextAccounts);
      });

    const onHideSubscription = modal!.on("onHide", ({ hideReason }) => {
      console.log(`The reason for hiding the modal ${hideReason}`);
    });

    return () => {
      try {
        subscription.unsubscribe();
        onHideSubscription.remove();
      } catch (e) {
        console.error(e);
      }
    };
  }, [selector, modal]);

  const walletSelectorContextValue = useMemo<WalletSelectorContextValue>(() => {
    let account = accounts.find((account) => account.active) || null;
    let accountId = account ? account.accountId : null;
    const activeWallet = selector
      ? selector.store.getState().selectedWalletId
      : null;

    return {
      selector: selector!,
      modal: modal!,
      accounts,
      account,
      accountId,
      loading,
      isEthereumWallet: activeWallet === ETHEREUM_WALLETS_CONNECTOR,
      activeWalletId: activeWallet,
    };
  }, [selector, modal, accounts, loading]);

  if (loading) {
    return null;
  }

  return (
    <WalletSelectorContext.Provider value={walletSelectorContextValue}>
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    );
  }

  return context;
}
