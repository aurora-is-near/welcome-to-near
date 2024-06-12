"use client";
import React, { useCallback, useMemo, useState } from "react";
import ValidatorSelector from "./components/ValidatorSelector";
import { STAKING_ACTIONS, useStaking } from "./context";
import { useRouter } from "next/navigation";
import { Validator } from "./utils";
import { debounce } from "@/utils/debounce";
import { goBack } from "./routing";

const buildValidatorLink = (action: string) => {
  return (accountId: string) => {
    return `/staking/${action}/${accountId}`;
  };
};

export default function ValidatorList({ action }: { action: STAKING_ACTIONS }) {
  const { validators, stakedValidators, validatorsWithWithdrawAvailable } =
    useStaking();
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const debouncedSetFilter = useCallback(
    debounce((value: string) => {
      setFilter(value);
    }, 500),
    []
  );
  const { validatorsToRender, noResults, noFilter, disableFilter } =
    useMemo(() => {
      if (
        stakedValidators === null ||
        validatorsWithWithdrawAvailable === null ||
        validators === null
      )
        return {
          validatorsToRender: [],
          noResults: true,
          noFilter: true,
          disableFilter: true,
        };
      let idsToRender: string[] = [];
      switch (action) {
        case "stake":
          idsToRender = Object.keys(validators);
          break;
        case "unstake":
          idsToRender = stakedValidators;
          break;
        case "withdraw":
          idsToRender = validatorsWithWithdrawAvailable;
          break;
        default:
          break;
      }
      const validatorsToRender: Validator[] = [];
      idsToRender.forEach((accountId) => {
        if (accountId.includes(filter)) {
          validatorsToRender.push(validators[accountId]);
        }
      });
      return {
        validatorsToRender,
        noResults: validatorsToRender.length === 0,
        noFilter: filter === "",
        disableFilter: false,
      };
    }, [stakedValidators, validatorsWithWithdrawAvailable, validators, filter]);

  return (
    <ValidatorSelector
      disableFilter={disableFilter}
      onFilter={debouncedSetFilter}
      buildValidatorLink={buildValidatorLink(action)}
      onBack={goBack(router)}
      validators={validatorsToRender}
      loading={noResults && noFilter}
      noMatchesFound={noResults && !noFilter}
    />
  );
}
