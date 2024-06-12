import supabase from "@/supabase/client";

export const ENDPOINT_ALL = "https://apis.dappradar.com/v2/dapps";
export const ENDPOINT_TOP =
  "https://apis.dappradar.com/v2/dapps/top/transactions";

export const getAllApps = async () => {
  const { data, error } = await supabase
    .from("dappradar")
    .select("data")
    .eq("endpoint", ENDPOINT_ALL)
    .single();

  if (error) throw error;

  return data?.data;
};

export const getTopApps = async () => {
  const { data, error } = await supabase
    .from("dappradar")
    .select("data")
    .eq("endpoint", ENDPOINT_TOP)
    .single();

  if (error) throw error;

  return data?.data;
};
