import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TabularSection from 'metadata-react/TabularSection';

class Params extends React.Component {
  // 46e84fa0-8280-11f0-b343-1b7cf6ad6e51
  constructor(props, context) {
    super(props, context);
    const {cat, utils} = $p;
    this._meta = utils._clone(cat.characteristics.metadata('params'));
    cat.scheme_settings.find_rows({obj: 'cat.characteristics.params'}, (scheme) => {
      if(scheme.name.endsWith('dop')) {
        this.scheme = scheme;
      }
    });
  }

  filter = (collection) => {
    let ox = this.props.ox,
        res = [];

    let upd = [
      {param:'Система', value:ox.sys?.name},
      {param:'Цвет',    value:ox.clr?.name}
    ].filter(e=>e.value!=null);

    let Hide = {Автоуравнивание:1},
        Conv = {Длина:e=>e.value+' мм'}

    collection.forEach(row => {
      let n = row.param?.name;
      if (!n || Hide[n]) return;
      if (Conv[n]) upd.push({param:n, value:Conv[n](row)});
      else res.push(row);
    });
    return upd.concat(res);
  };

  render() {
    const ox = this.props.ox,
          rows = this.filter(ox.params),
          minHeight = 35 + 34 * rows.length;
    
    if(!rows.length) return null;

    return this.scheme ?
      <div style={{marginTop:'1.5em'}}>
        <div style={{height: minHeight}}>
          <TabularSection
            _obj={ox}
            _meta={this._meta}
            _tabular="params"
            scheme={this.scheme}
            filter={this.filter}
            minHeight={minHeight}
            read_only
            disable_cache
            hideToolbar
            denySort
          />
        </div>
      </div>
      :
      <Typography key="err-nom" color="error">
        {`Не найден элемент scheme_settings characteristics.params.dop`}
      </Typography>;
  }
}

Params.propTypes = {
  ox: PropTypes.object.isRequired,
  cnstr: PropTypes.number.isRequired,
};

export default Params;
