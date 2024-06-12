"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AccessKeyInfoView,
  FunctionCallPermissionView,
} from "near-api-js/lib/providers/provider";
import ConnectAccount from "@/components/Staking/components/ConnectAccount";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { fetchAccessKeys } from "@/utils/near";
import { formatUnits } from "viem";
import { Card, CardPadding } from "@/components/Card";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

const AccountPage = () => {
  const { accountId, selector } = useWalletSelector();
  const [dappAccessKeys, setDappAccessKeys] = useState<AccessKeyInfoView[]>([]);
  const [onboardingAccessKeys, setOnboardingAccessKeys] = useState<
    AccessKeyInfoView[]
  >([]);

  const updateAccessKeys = useCallback(async () => {
    if (!accountId) return;
    const allKeys = await fetchAccessKeys(accountId);
    const dappAccessKeys = allKeys.filter(
      (key) =>
        key.access_key.permission !== "FullAccess" &&
        key.access_key.permission.FunctionCall.receiver_id !== accountId
    );
    setDappAccessKeys(dappAccessKeys);
    const onboardingAccessKeys = allKeys.filter(
      (key) =>
        key.access_key.permission !== "FullAccess" &&
        key.access_key.permission.FunctionCall.receiver_id === accountId &&
        key.access_key.permission.FunctionCall.method_names[0] === "rlp_execute"
    );
    setOnboardingAccessKeys(onboardingAccessKeys);
  }, [accountId]);

  useEffect(() => {
    updateAccessKeys();
  }, [updateAccessKeys]);

  const isEthereumWallet = useMemo(
    () => selector.store.getState().selectedWalletId === "ethereum-wallets",
    [selector, accountId]
  );

  const onDeauthorize = useCallback(
    async (publicKey: string) => {
      if (!accountId) {
        return;
      }
      const wallet = await selector.wallet();
      const tx = await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: accountId,
        actions: [
          {
            type: "DeleteKey",
            params: {
              publicKey: publicKey,
            },
          },
        ],
      });
      console.log("Sent transaction:", tx);
      await new Promise((r) => setTimeout(r, 3000));
      updateAccessKeys();
    },
    [selector, accountId, updateAccessKeys]
  );

  if (!accountId) return <ConnectAccount />;

  return (
    <>
      <Card>
        <CardPadding className="!pb-0">
          <h2 className="font-sans text-2xl font-medium leading-[1.3] text-sand-12">
            Authorized apps
          </h2>
        </CardPadding>

        {dappAccessKeys.length ? (
          <ul className="divide-y divide-sand-5">
            {dappAccessKeys.map((key) => (
              <li key={key.public_key}>
                <CardPadding>
                  <div className="flex flex-col items-start gap-x-4 gap-y-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-base font-semibold leading-normal tracking-wider text-sand-12">
                      {
                        (
                          key.access_key
                            .permission as FunctionCallPermissionView
                        ).FunctionCall.receiver_id
                      }
                    </div>
                    <button
                      className="-ml-2 rounded-lg px-2 py-1 text-sm font-semibold leading-normal tracking-wider text-red-500 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none sm:-mr-2 sm:ml-0"
                      onClick={() => onDeauthorize(key.public_key)}
                    >
                      Deauthorize
                    </button>
                  </div>
                  <div className="mt-2 overflow-hidden text-ellipsis rounded-lg bg-sand-3 px-4 py-4 text-base leading-none text-sand-11">
                    {key.public_key}
                  </div>
                  <div className="mt-2 text-sm leading-normal tracking-wider text-sand-11">
                    Fee allowance:{" "}
                    <span className="font-bold">
                      {formatUnits(
                        BigInt(
                          (
                            key.access_key
                              .permission as FunctionCallPermissionView
                          ).FunctionCall.allowance ?? "0"
                        ),
                        24
                      )}{" "}
                      NEAR
                    </span>
                  </div>
                </CardPadding>
              </li>
            ))}
          </ul>
        ) : (
          <CardPadding>
            <p className="text-base leading-normal tracking-wider text-sand-12">
              You haven’t authorized any apps yet.
            </p>
          </CardPadding>
        )}
      </Card>

      {isEthereumWallet && (
        <Card>
          <CardPadding>
            <h2 className="font-sans text-2xl font-medium leading-[1.3] text-sand-12">
              Onboarding key
            </h2>
            <p className="mt-4 text-base leading-normal tracking-wider text-sand-12">
              This key enables your Ethereum wallet account to transact on NEAR
              Protocol.
            </p>
            {onboardingAccessKeys.length ? (
              <ul className="mt-4 space-y-4">
                {onboardingAccessKeys.map((key) => (
                  <li
                    key={key.public_key}
                    className="overflow-hidden text-ellipsis rounded-lg bg-sand-3 px-4 py-4 text-base leading-none text-sand-11"
                  >
                    {key.public_key}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 flex rounded-lg bg-blue-50 px-4 py-4">
                <InformationCircleIcon
                  className="h-5 w-5 flex-shrink-0 text-blue-400"
                  aria-hidden="true"
                />
                <p className="ml-3 text-sm tracking-wider text-blue-700">
                  Your account is not yet onboarded, re-connect your wallet to
                  onboard.
                </p>
              </div>
            )}
          </CardPadding>
        </Card>
      )}
    </>
  );
};

export default AccountPage;
