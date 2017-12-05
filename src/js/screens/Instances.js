import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';

import NavControl from '../components/NavControl';

import { pageLoaded } from './utils';

class Instances extends Component {
  componentDidMount() {
    pageLoaded('Instances');
  }

  render() {
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
            Instances
          </Heading>
        </Box>
      </Article>
    );
  }
}

Instances.defaultProps = {
};

Instances.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.Instances });

export default connect(select)(Instances);
