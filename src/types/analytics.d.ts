export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  affiliation?: string;
  coupon?: string;
  currency?: string;
  discount?: number;
  index?: number;
  item_brand?: string;
  item_category?: string;
  item_list_id?: string;
  item_list_name?: string;
  item_variant?: string;
  location_id?: string;
  price?: number;
  quantity?: number;
};

// Contains a combination of built-in and custom GA4 events. For the former, see:
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events
export type AnalyticsEvent = {
  interest: {
    click: string;
  };
  lead: {
    action: string;
  };
  swap: {
    from?: string;
    to?: string;
    status: string;
  };
  explore: {
    app: string;
    website: string;
  };
  send: {
    token: string;
  };
  staking: {
    action: string;
    validator: string;
    token?: string;
  };
  purchase: {
    // TODO: Use valid parameters for the purchase event
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#purchase
    action: string;
  };
  select_item: {
    item_list_id?: string;
    item_list_name?: string;
    items: AnalyticsItem[];
  };
  select_content: {
    content_type?: string;
    item_id?: string;
  };
  search: {
    search_term: string;
  };
  share: {
    method?: string;
    content_type?: string;
    item_id?: string;
  };
};

export type AnalyticsValue = string | number | AnalyticsItem[];
export type AnalyticsData = Record<string, AnalyticsValue>;

export type AnalyticsShareMethods =
  | "discord"
  | "telegram"
  | "twitter"
  | "you_tube";
