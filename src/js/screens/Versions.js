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

import { loadVersions, unloadVersions , deleteVersion } from '../actions/versions';

import { pageLoaded } from './utils';

class Versions extends Component {
  
  componentDidMount() {
    pageLoaded('Versions');
    this.props.dispatch(loadVersions());
  }

  componentWillUnount() {
    this.props.dispatch(unloadVersions());
  }

  render() {
    const { error, versions } = this.props;
    const { intl } = this.context;
    const rows = versions.map(version => {
      let status = <Status value='critical' />;
      if(version.status == 'yellow') {
        status = <Status value='warning' />;
      } else if(version.status == 'green') {
        status = <Status value='ok' />;
      }
      return (
         <TableRow key={version.id}>
          <td>
            {version.id}
          </td>
          <td>
            {status}
          </td>
          <td>
            <Value value={30}
              units='%'
              align='start'
              size='small'
            />
            <Meter vertical={false}
              value={30}
            />
          </td>
          <td>
            {version.instanceCount}
          </td>
          <td>
            {version.runtime}
          </td>
          <td>
            {version.environment}
          </td>
          <td>
            <Button icon={<CloseIcon />}
              onClick={() => 
                this.props.dispatch(deleteVersion(version.id))
              }
              href='#'
              primary={false}
              secondary={false}
              accent={false}
              critical={false}
              plain={false} />
          </td>
        </TableRow>
      );
    });

    const services = ['default', 'backend-api'];
    const serviceSelector = (
      <Select placeHolder='select a service'
        inline={false}
        multiple={false}
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
         {rows}
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
  error: undefined,
  versions: []
};

Versions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  versions: PropTypes.arrayOf(PropTypes.object)
};

Versions.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.versions });

export default connect(select)(Versions);
