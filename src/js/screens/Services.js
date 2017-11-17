import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import CloseIcon from 'grommet/components/icons/base/Close';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import { getMessage } from 'grommet/utils/Intl';


import NavControl from '../components/NavControl';

import { pageLoaded } from './utils';

class Services extends Component {
  componentDidMount() {
    pageLoaded('Services');
  }

  render() {
    const { intl } = this.context;

    const table = (
      <Table scrollable={false}>
        <thead>
          <tr>
            <th>
              Id
            </th>
            <th>
              Versions Count
            </th>
            <th>
              Last Deployment
            </th>
            <th>
              Last Deployer
            </th>
            <th>
              {/* Delete button column placeholder. */}
            </th>
          </tr>
        </thead>
        <tbody>
          <TableRow>
            <td>
              default
            </td>
            <td>
              5
            </td>
            <td>
              May 9, 2017, 11:56:14 PM
            </td>
            <td>
              service-account@google.com
            </td>
            <td>
              <Button icon={<CloseIcon />}
                onClick={() => alert('hi')}
                href='#'
                primary={false}
                secondary={false}
                accent={false}
                critical={false}
                plain={false} />
            </td>
          </TableRow>
          <TableRow>
            <td>
              backend-api
            </td>
            <td>
              7
            </td>
            <td>
              May 31, 2017, 7:24:08 PM
            </td>
            <td>
              freefood@google.com
            </td>
            <td>
              <Button icon={<CloseIcon />}
                onClick={() => alert('hi')}
                href='#'
                primary={false}
                secondary={false}
                accent={false}
                critical={false}
                plain={false} />
            </td>
          </TableRow>
        </tbody>
      </Table>
    );

    return (
      <Article primary={true}>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
          <NavControl name={getMessage(intl, 'Services')} />
        </Header>
        <Box pad='medium'>
          {table}
        </Box>
      </Article>
    );
  }
}

Services.defaultProps = {
};

Services.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Services.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.services });

export default connect(select)(Services);
