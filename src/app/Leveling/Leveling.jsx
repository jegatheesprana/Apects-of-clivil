import React, { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';

const defaultRow = {bs: '', is: '', fs: ''}
const defaultDis = {rise: '', fall: '', height: '', rl: ''}
const Leveling = () => {
    const [rows, setRows] = useState([{...defaultRow}])
    const [displays, setdisplays] = useState([{...defaultDis}])
    const [initial, setInitial] = useState(50)
    const [initialBs, setInitialBs] = useState(5.250)
    const [sum, setSum] = useState({sBs: 0, sFs: 0})

    const handleAdd = () => {
        setRows([...rows, {...defaultRow}])
        setdisplays([...displays, {...defaultDis}])
    }
    const handleRowChange = (e, id) => {
        e.persist();
        setRows(rows => {
            let values = [...rows];
            values[id][e.target.name] = e.target.value;
            return values;
        })
    }
    const handleInitChange = e => {
        setInitial(e.target.value)
    }
    const handleInitBsChange = e => {
        setInitialBs(e.target.value)
    }
    useEffect(()=>{
        const rows_ = [...rows]
        const displays_ = [...displays]
        let col = 0;
        let pre = initial;
        let preReading = initialBs;
        let height = initialBs + initial;
        let sBs = initialBs;
        let sFs = 0
        rows_.forEach((item, id) => {
            let incre = Number((preReading - (Number(item.is) || Number(item.fs) || 0)).toFixed(5));
            if (incre >= 0){
                displays_[id].rise = incre
                displays_[id].fall = ''
            }
            else {
                displays_[id].rise = ''
                displays_[id].fall = -incre
            }
            pre = Number((pre+incre).toFixed(5))
            displays_[id].rl = pre
            preReading = (Number(item.is) || Number(item.fs) || 0)
            if(item.bs) {
                preReading = Number(item.bs)
                sBs += Number(item.bs)
            } else {
                displays_[id].height = ''
            }
            if (item.fs) {
                sFs += Number(item.fs)
            }
            if (item.bs && item.fs) {
                height = Number((height + Number(item.bs) - Number(item.fs)).toFixed(5))
                displays_[id].height = height
            }
        })
        setdisplays(displays_)
        setSum({sBs, sFs})
    }, [rows, initialBs, initial])
    return (
        <>
        <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Leveling</h4>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>BS</th>
                        <th>IS</th>
                        <th>FS</th>
                        <th>Rise</th>
                        <th>Fall</th>
                        <th>H of instrument</th>
                        <th>RL</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <Form.Control type="text" name="bs" value={initialBs} onChange={handleInitBsChange} className="form-control-sm" placeholder="BS" style={{ backgroundColor: 'unset', color: 'white' }} />
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{initial+initialBs}</td>
                        <td>
                            <Form.Control type="text" name="fs" value={initial} onChange={handleInitChange} className="form-control-sm" placeholder="BS" style={{ backgroundColor: 'unset', color: 'white' }} />
                        </td>
                    </tr>
                      {rows.map((item, id) => (
                            <tr key={id} style={{color: 'white'}}>
                                <td>
                                    <Form.Control type="text" name="bs" value={item.bs} onChange={e => handleRowChange(e, id)} className="form-control-sm" placeholder="BS" style={{ backgroundColor: 'unset', color: 'white' }} />
                                </td>
                                <td>
                                    <Form.Control type="text" name="is" value={item.is} onChange={e => handleRowChange(e, id)} className="form-control-sm" placeholder="IS" style={{ backgroundColor: 'unset', color: 'white' }} />
                                </td>
                                <td>
                                    <Form.Control type="text" name="fs" value={item.fs} onChange={e => handleRowChange(e, id)} className="form-control-sm" placeholder="FS" style={{ backgroundColor: 'unset', color: 'white' }} />
                                </td>
                                <td>{displays[id].rise}</td>
                                <td>{displays[id].fall}</td>
                                <td>{displays[id].height}</td>
                                <td>{displays[id].rl}</td>
                            </tr>
                      ))}
                      <tr>
                          <td><button type="button" className="btn btn-primary btn-fw mb-2" onClick={handleAdd}>Add</button></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                      </tr>
                      <tr>
                        <td>{sum.sBs}</td>
                        <td></td>
                        <td>{sum.sFs}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{displays[displays.length-1].rl} - {initial} = {Number((displays[displays.length-1].rl - initial).toFixed(5))}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
     );
}
 
export default Leveling;