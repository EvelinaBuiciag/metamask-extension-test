import React from 'react';
import { fireEvent } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockState from '../../../../test/data/mock-state.json';
import { renderWithProvider } from '../../../../test/lib/render-helpers';
import { updateNftDropDownState } from '../../../store/actions';
import NftsItems from '.';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ search: '' })),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../store/actions.ts', () => ({
  ...jest.requireActual('../../../store/actions.ts'),
  updateNftDropDownState: jest.fn().mockReturnValue(jest.fn()),
}));

describe('NFTs Item Component', () => {
  const nfts =
    mockState.metamask.allNfts[mockState.metamask.selectedAddress][5];
  const props = {
    collections: {
      '0x0dcd5d886577d5081b0c52e242ef29e70be3e7bc': {
        nfts,
        collectionImage: '',
        collectionName: 'NFT Collection',
      },
    },
    previouslyOwnedCollection: {
      nfts: [],
    },
  };

  const mockStore = configureMockStore([thunk])(mockState);

  it('should expand NFT collection showing individual NFTs', async () => {
    const { queryByTestId, queryAllByTestId, rerender } = renderWithProvider(
      <NftsItems {...props} />,
      mockStore,
    );

    const collectionExpanderButton = queryByTestId(
      'collection-expander-button',
    );

    expect(queryAllByTestId('nft-wrapper')).toHaveLength(0);

    fireEvent.click(collectionExpanderButton);

    expect(updateNftDropDownState).toHaveBeenCalledWith({
      '0x0dcd5d886577d5081b0c52e242ef29e70be3e7bc': {
        '0x5': {
          '0x0dcd5d886577d5081b0c52e242ef29e70be3e7bc': true,
          '0x495f947276749Ce646f68AC8c248420045cb7b5e': false,
        },
      },
    });

    rerender(<NftsItems {...props} />, mockStore);

    expect(queryAllByTestId('nft-wrapper')).toHaveLength(8);
  });

  it('should NFT click image', () => {
    const { queryAllByTestId } = renderWithProvider(
      <NftsItems {...props} />,
      mockStore,
    );

    const nftImages = queryAllByTestId('nft-image');

    fireEvent.click(nftImages[0]);

    const firstNft = nfts[0];
    const nftRoute = `/asset/${firstNft.address}/${firstNft.tokenId}`;

    expect(mockHistoryPush).toHaveBeenCalledWith(nftRoute);
  });
});
