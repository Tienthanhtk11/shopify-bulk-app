import '@shopify/ui-extensions/preact';
import {
  useAuthenticatedAccountCustomer,
  useSessionToken,
} from '@shopify/ui-extensions/customer-account/preact';
import {render} from 'preact';
import {useEffect, useState} from 'preact/hooks';

const APP_URL = 'https://app.thanhpt.online';

const BOARD_COLUMNS = 'minmax(0, 2fr) minmax(0, 1.2fr) auto';

function formatDate(value) {
  if (!value) return 'Not scheduled yet';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not scheduled yet';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function formatStatus(status) {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'PAUSED':
      return 'Paused';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

function formatPaymentStatus(status) {
  if (!status) return 'No billing attempt recorded in Shopify yet';

  return status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildStats(contracts) {
  return contracts.reduce(
    (summary, contract) => {
      summary.total += 1;
      if (contract.status === 'ACTIVE') summary.active += 1;
      if (contract.status === 'PAUSED') summary.paused += 1;
      if (contract.status === 'CANCELLED') summary.cancelled += 1;
      return summary;
    },
    {total: 0, active: 0, paused: 0, cancelled: 0},
  );
}

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const customer = useAuthenticatedAccountCustomer();
  const sessionToken = useSessionToken();
  const [state, setState] = useState({
    loading: true,
    error: '',
    success: '',
    contracts: [],
    busyContractId: '',
    busyIntent: '',
    paymentMethodHelp: '',
  });
  const stats = buildStats(state.contracts);

  async function requestContracts(intent = '', contractId = '') {
    const token = await sessionToken.get();
    const endpoint = new URL('/apps/subbulk/customer-account/subscriptions', APP_URL);
    const body = new URLSearchParams();
    body.set('session_token', token);
    if (intent) body.set('intent', intent);
    if (contractId) body.set('contractId', contractId);

    const response = await fetch(endpoint.toString(), {
      method: 'POST',
      body,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error || 'SubBulk could not load your subscriptions.',
      );
    }

    return data;
  }

  async function loadContracts() {
    if (!customer?.id) {
      setState({
        loading: false,
        error: 'Customer details are not available yet.',
        success: '',
        contracts: [],
        busyContractId: '',
        busyIntent: '',
        paymentMethodHelp: '',
      });
      return;
    }

    setState((current) => ({
      ...current,
      loading: true,
      error: '',
      success: '',
    }));

    try {
      const data = await requestContracts();

      setState({
        loading: false,
        error: '',
        success: typeof data.success === 'string' ? data.success : '',
        contracts: Array.isArray(data.contracts) ? data.contracts : [],
        busyContractId: '',
        busyIntent: '',
        paymentMethodHelp:
          typeof data.paymentMethodHelp === 'string' ? data.paymentMethodHelp : '',
      });
    } catch (error) {
      setState({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'SubBulk could not load your subscriptions.',
        success: '',
        contracts: [],
        busyContractId: '',
        busyIntent: '',
        paymentMethodHelp: '',
      });
    }
  }

  async function handleContractAction(intent, contractId) {
    if (!contractId) return;

    setState((current) => ({
      ...current,
      error: '',
      success: '',
      busyContractId: contractId,
      busyIntent: intent,
    }));

    try {
      const data = await requestContracts(intent, contractId);

      setState({
        loading: false,
        error: '',
        success:
          typeof data.success === 'string' && data.success
            ? data.success
            : 'Your subscription has been updated.',
        contracts: Array.isArray(data.contracts) ? data.contracts : [],
        busyContractId: '',
        busyIntent: '',
        paymentMethodHelp:
          typeof data.paymentMethodHelp === 'string' ? data.paymentMethodHelp : '',
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        error:
          error instanceof Error
            ? error.message
            : 'SubBulk could not update your subscription.',
        success: '',
        busyContractId: '',
        busyIntent: '',
      }));
    }
  }

  useEffect(() => {
    loadContracts();
  }, [customer?.id]);

  return (
    <s-stack
      direction="block"
      gap="large"
      background="base"
      border="base"
      borderRadius="large"
      padding="large"
    >
      <s-stack direction="block" gap="small">
        <s-text>Subscription center</s-text>
        <s-heading>SubBulk subscriptions</s-heading>
        <s-text>
          Manage every plan from your profile with quick actions for pause,
          resume, and cancel.
        </s-text>
        {state.paymentMethodHelp ? <s-text>{state.paymentMethodHelp}</s-text> : null}
      </s-stack>

      <s-grid gridTemplateColumns="repeat(4, minmax(0, 1fr))" gap="small">
        <s-stack background="subdued" border="base" borderRadius="large" padding="base" gap="none">
          <s-text>Total</s-text>
          <s-heading>{String(stats.total)}</s-heading>
        </s-stack>
        <s-stack background="subdued" border="base" borderRadius="large" padding="base" gap="none">
          <s-text>Active</s-text>
          <s-heading>{String(stats.active)}</s-heading>
        </s-stack>
        <s-stack background="subdued" border="base" borderRadius="large" padding="base" gap="none">
          <s-text>Paused</s-text>
          <s-heading>{String(stats.paused)}</s-heading>
        </s-stack>
        <s-stack background="subdued" border="base" borderRadius="large" padding="base" gap="none">
          <s-text>Cancelled</s-text>
          <s-heading>{String(stats.cancelled)}</s-heading>
        </s-stack>
      </s-grid>

      {!state.loading && state.success ? (
        <s-banner tone="success" heading="Subscription updated">
          <s-text>{state.success}</s-text>
        </s-banner>
      ) : null}

      {!state.loading && state.error ? (
        <s-banner tone="critical" heading="Action unavailable">
          <s-text>{state.error}</s-text>
        </s-banner>
      ) : null}

      {state.loading ? (
        <s-stack background="subdued" border="base" borderRadius="large" padding="large" gap="small">
          <s-heading>Loading subscriptions...</s-heading>
          <s-text>Fetching the latest status for this customer.</s-text>
        </s-stack>
      ) : null}

      {!state.loading && !state.error && state.contracts.length === 0 ? (
        <s-stack background="subdued" border="base" borderRadius="large" padding="large" gap="small">
          <s-heading>No subscriptions yet</s-heading>
          <s-text>
            When this customer starts a subscription, it will appear here with
            full self-service actions.
          </s-text>
        </s-stack>
      ) : null}

      {!state.loading && !state.error && state.contracts.length > 0 ? (
        <s-stack direction="block" gap="small">
          <s-grid
            gridTemplateColumns={BOARD_COLUMNS}
            gap="small"
            padding="small"
            border="base"
            borderRadius="large"
            background="subdued"
          >
            <s-text>Subscription</s-text>
            <s-text>Schedule</s-text>
            <s-text>Actions</s-text>
          </s-grid>

          {state.contracts.map((contract) => {
            const isBusy = state.busyContractId === contract.id;

            return (
              <s-grid
                key={contract.id}
                gridTemplateColumns={BOARD_COLUMNS}
                gap="small"
                padding="large"
                border="base"
                borderRadius="large"
                background="base"
              >
                <s-stack direction="block" gap="small">
                  <s-heading>{contract.lineTitle}</s-heading>
                  <s-stack direction="inline" gap="small" alignItems="center">
                    <s-stack
                      direction="inline"
                      gap="none"
                      paddingInline="small"
                      paddingBlock="small-100"
                      border="base"
                      borderRadius="max"
                      background="subdued"
                    >
                      <s-text>{formatStatus(contract.status)}</s-text>
                    </s-stack>
                    <s-text>#{contract.shortId}</s-text>
                    <s-text>Qty {contract.quantity}</s-text>
                  </s-stack>
                </s-stack>

                <s-stack direction="block" gap="none">
                  <s-text>Next billing: {formatDate(contract.nextBillingDate)}</s-text>
                  <s-text>Started: {formatDate(contract.createdAt)}</s-text>
                  <s-text>
                    Payment method: {contract.paymentMethodLabel || 'Shopify has not exposed payment method details yet'}
                  </s-text>
                  <s-text>
                    Last payment: {formatPaymentStatus(contract.lastPaymentStatus)}
                  </s-text>
                </s-stack>

                <s-stack direction="inline" gap="small" justifyContent="end" alignItems="start">
                  {contract.status === 'ACTIVE' ? (
                    <s-button
                      variant="secondary"
                      loading={isBusy && state.busyIntent === 'pause'}
                      disabled={Boolean(state.busyContractId)}
                      onClick={() => handleContractAction('pause', contract.id)}
                    >
                      Pause
                    </s-button>
                  ) : null}
                  {contract.status === 'PAUSED' ? (
                    <s-button
                      variant="primary"
                      loading={isBusy && state.busyIntent === 'resume'}
                      disabled={Boolean(state.busyContractId)}
                      onClick={() => handleContractAction('resume', contract.id)}
                    >
                      Resume
                    </s-button>
                  ) : null}
                  {contract.status !== 'CANCELLED' ? (
                    <s-button
                      variant="secondary"
                      tone="critical"
                      loading={isBusy && state.busyIntent === 'cancel'}
                      disabled={Boolean(state.busyContractId)}
                      onClick={() => handleContractAction('cancel', contract.id)}
                    >
                      Cancel
                    </s-button>
                  ) : null}
                </s-stack>
              </s-grid>
            );
          })}
        </s-stack>
      ) : null}
    </s-stack>
  );
}