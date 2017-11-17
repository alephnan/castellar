import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';

import NavControl from '../components/NavControl';

import { pageLoaded } from './utils';

class Versions extends Component {
  componentDidMount() {
    pageLoaded('Versions');
  }


  render() {
    const { intl } = this.context;

    return (
      <Article primary={true}>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
          <NavControl />
        </Header>
        <Box pad='medium'>
          <Heading tag='h3' strong={true}>
            Versions
          </Heading>
        </Box>
      </Article>
    );
  }
}

Versions.defaultProps = {
};

Versions.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Versions.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.Versions });

export default connect(select)(Versions);
