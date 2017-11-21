import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Animate from 'grommet/components/Animate';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import CloseIcon from 'grommet/components/icons/base/Close';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Meter from 'grommet/components/Meter';
import Select from 'grommet/components/Select';
import Spinning from 'grommet/components/icons/Spinning';
import Status from 'grommet/components/icons/Status';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Toast from 'grommet/components/Toast';
import Value from 'grommet/components/Value';
import { getMessage } from 'grommet/utils/Intl';

import NavControl from '../components/NavControl';

import { loadServices } from '../actions/services';
import { loadVersions,  deleteVersion , selectService , resetToast } from '../actions/versions';

import { pageLoaded } from './utils';

class Versions extends Component {
  
  componentDidMount() {
    pageLoaded('Versions');
    this.props.dispatch(loadServices());
    this.props.dispatch(loadVersions());
  }

  render() {
    const { error, serviceIds, versionsWithAllocation , servicesLoaded , selectedService , loading , loadingVersionsForService , toastMessageDeletedVersionId } = this.props;
    const { intl } = this.context;

    const showToast = !!toastMessageDeletedVersionId;
    // TODO: This should be added to DOM outside of the Version Screen, and in the root view instead.
    const toast = (
      <Toast status='ok'
          onClose={() => {
            this.props.dispatch(resetToast());
          }}>
        Deleted version: <em>{toastMessageDeletedVersionId}</em>
      </Toast>
    );

    const rows = versionsWithAllocation.map(version => {
      let status = <Status value='critical' />;
      if(version.status == 'yellow') {
        status = <Status value='warning' />;
      } else if(version.status == 'green') {
        status = <Status value='ok' />;
      }
      let allocationCell = (
        <td>
          <Spinning /> 
        </td>
      );
      if(servicesLoaded) {
        const allocation = version.allocation;
        allocationCell = (
          <td>
            <Value value={allocation}
              units='%'
              align='start'
              size='small'
            />
            <Meter vertical={false}
              value={allocation}
            />
          </td>
        );
      }
      return (
         <TableRow key={version.id}>
          <td>
            {version.id}
          </td>
          <td>
            {status}
          </td>
          {allocationCell}
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

    const serviceSelectorBox = servicesLoaded ? (
      <Box size='medium'>
        <Select placeHolder='select a service'
        inline={false}
        multiple={false}
        options={serviceIds}
        onChange={({value}) => {
          this.props.dispatch(selectService(value))
        }}
        value={
          selectedService
        }/>
      </Box>
    ) : (
      <Box size='medium'>
      </Box>
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
        { showToast ? toast : null}

        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
        <NavControl name={getMessage(intl, 'Versions')} />
          {serviceSelectorBox}
        </Header>
        <Box pad='medium'>
          <Animate
            enter={{"animation": "fade", "duration": 1500, "delay": 0}}
            keep={false}>
          {loadingVersionsForService ? <Spinning /> : table}
          </Animate>
        </Box>
      </Article>
    );
  }
}

Versions.defaultProps = {
  error: undefined,
  services: [],
  versionsWithAllocation: [],
  selectedService: 'default',
  loadingVersionsForService: false,
  toastMessage: undefined,
};

Versions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  selectedService: PropTypes.string,
  services: PropTypes.arrayOf(PropTypes.object),
  versionsWithAllocation: PropTypes.arrayOf(PropTypes.object),
};

Versions.contextTypes = {
  intl: PropTypes.object
};


const select = state => {
  const loadingVersionsForService = state.versions.loadingVersionsForService;
  const serviceId = state.versions.selectedService;
  const service = state.services.services.find(({id}) => id == serviceId);
  const allocationByVersionId = service ? new Map(service.allocations.map(({id, allocation}) => [id, allocation])) : new Map();
  const versionsWithAllocation = state.versions.versions.map(version => {
    return {
      ...version,
      allocation: allocationByVersionId.get(version.id) || 0
    }
  });

  return {
    selectedService: state.versions.selectedService,
    serviceIds: state.services.services.map(({id}) => id),
    versionsWithAllocation,
    servicesLoaded: state.services.services.length > 0,
    loadingVersionsForService,
    toastMessageDeletedVersionId: state.versions.toastMessageDeletedVersionId
  };
};

export default connect(select)(Versions);
