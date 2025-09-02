import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {withIface} from 'metadata-redux';
import Builder from '../Builder';
import Props from '../Props/Main';
import Params from './Params';
import withStyles, {WorkPlace, WorkPlaceFrame} from '../App/WorkPlace';

class Otliv extends WorkPlace {
  // 46e84fa0-8280-11f0-b343-1b7cf6ad6e51
  barcodeFin(bar) {
    const {state: {full_picture}, editor: {project}} = this;
    const {cnstr, ox} = bar;
    console.log(bar)
    project.load(ox, {auto_lines: false, custom_lines: true, unfolding: !full_picture, redraw: true})
      .then(() => {
        // if(full_picture) return;
        clearTimeout(project._attr._vis_timer);
        project.zoom_fit();
        this.setState(bar);
      });
  }

  render() {
    const {state: {full_picture, ox}, props: {classes}} = this;
    const comment = ox.calc_order_row?.note || '';
    return <WorkPlaceFrame>
      <Grid item sm={12} md={full_picture ? 7 : 8} className={classes.workplace}>
        <Builder registerChild={this.registerEditor}/>
      </Grid>
      <Grid item sm={12} md={full_picture ? 5 : 4} className={classes.props}>
        <Props {...this.state} style={{marginTop:'1em'}} show_spec={false} changeFull={this.changeFull}/>
        {ox && ox.empty && !ox.empty() ? <Params {...this.state}/> : null}
        {comment ? <div style={{marginTop:'1.5em'}}>⚠️ Коммент: {comment}</div> : null}
      </Grid>
      <style>{
       `.MuiTableCell-root{border-bottom:none;}`
     }</style>
    </WorkPlaceFrame>;
  }
}

Otliv.propTypes = {
  handleIfaceState: PropTypes.func.isRequired,
  title: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(withIface(Otliv));
