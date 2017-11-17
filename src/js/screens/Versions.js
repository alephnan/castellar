import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import CloseIcon from 'grommet/components/icons/base/Close';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Meter from 'grommet/components/Meter';
import Select from 'grommet/components/Select';
import Status from 'grommet/components/icons/Status';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Value from 'grommet/components/Value';
import { getMessage } from 'grommet/utils/Intl';

import NavControl from '../components/NavControl';

import { pageLoaded } from './utils';

class Versions extends Component {
  componentDidMount() {
    pageLoaded('Versions');
  }


  render() {
    const { intl } = this.context;
    
    const services = ['default', 'backend-api'];
    const serviceSelector = (
      <Select placeHolder='select a service'
        inline={false}
        multiple={false}
        onSearch={false}
        options={services}
        value={[]}/>
    );
    const table = (
      <Table scrollable={false}>
        <thead>
          <tr>
            <th>
              Id
            </th>
            <th>
              Status
            </th>
            <th>
              Traffic Allocation
            </th>
            <th>
              Instances Count
            </th>
            <th>
              Runtime
            </th>
            <th>
              Environment
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
              <Status value='ok' />
            </td>
            <td>
              <Value
                value='30'
                units='%'
                align='start'
                size='small'
              />
              <Meter value='30' />
            </td>
            <td>
              1
            </td>
            <td>
              python27
            </td>
            <td>
              standard
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
              <Status value='warning' />
            </td>
            <td>
              <Value
                value='50'
                units='%'
                align='start'
                size='small'
              />
              <Meter value='50' />
            </td>
            <td>
              0
            </td>
            <td>
              nodej
            </td>
            <td>
              flexible
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
              <Status value='critical' />
            </td>
            <td>
              <Value
                value='20'
                units='%'
                align='start'
                size='small'
              />
              <Meter value='20' />
            </td>
            <td>
              0
            </td>
            <td>
              nodej
            </td>
            <td>
              flexible
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
        <NavControl name={getMessage(intl, 'Versions')} />
        <Box size='medium'>
          {serviceSelector}
        </Box>
        </Header>
        <Box pad='medium'>

          {table}
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
