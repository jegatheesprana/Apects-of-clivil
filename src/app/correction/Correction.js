import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

const defaultBay = { length: 0, rise: 0 }

const Correction = () => {
    const [round, setRound] = useState(4)
    const [consts, setConsts] = useState({ coefficient_of_thermal: 0.000013, youngmodulus: 209000, density: 6900, area: 5, radius_of_the_earth: 6367, g: 9.81 })
    const [data, setData] = useState({ field_tension: 75, standard_tension: 90, field_tem: 28, standard_tem: 22.5, above_sea_level: 33.7 })
    // const [bays, setBays] = useState([{ ...defaultBay }])
    const [bays, setBays] = useState([{ length: 25.888, rise: 0.214 }, { length: 29.741, rise: 0.285 }, { length: 26.662, rise: 0.119 }])
    const [totalLength, setTotalLength] = useState(0)
    const [tapeWeight, setTapeWeight] = useState(0)

    const [slopCorr, setSlopCorr] = useState(0)
    const [tensionCorr, setTensionCorr] = useState(0)
    const [tempCorr, setTempCorr] = useState(0)
    const [sagCorr, setSagCorr] = useState(0)
    const [attrCorr, setAttrCorr] = useState(0)

    const [corrLength, setCorrLength] = useState(0)

    const handleconstChange = e => {
        e.persist();
        setConsts(consts => ({ ...consts, [e.target.name]: (e.target.value) }))
    }

    const handleDataChange = e => {
        e.persist();
        setData(data => ({ ...data, [e.target.name]: (e.target.value) }))
    }

    const handleAdd = () => {
        setBays([...bays, { ...defaultBay }])
    }

    const handleRemove = (id) => {
        setBays(bays => bays.filter(b_id => b_id !== id))
    }

    const handleBayChange = (e, id) => {
        e.persist();
        setBays(bays => {
            let values = [...bays];
            values[id][e.target.name] = (e.target.value);
            console.log(values)
            return values;
        })
    }

    useEffect(() => {
        setTotalLength(bays.reduce((total, current) => total + Number(current.length), 0))
    }, [bays])

    useEffect(() => {
        const slop = bays.reduce((total, current) => {
            if (current.length) return total + Math.pow(Number(current.rise), 2) / (2 * current.length)
            return total
        }, 0)
        setSlopCorr(-Number(slop.toFixed(round)))
    }, [bays, round])

    useEffect(() => {
        const tenstion = (consts.area * consts.youngmodulus) && ((data.field_tension - data.standard_tension) * totalLength) / (consts.area * consts.youngmodulus)
        setTensionCorr(Number(tenstion.toFixed(round)))
        const temp = consts.coefficient_of_thermal * totalLength * (data.field_tem - data.standard_tem)
        setTempCorr(Number(temp.toFixed(round)))
    }, [consts, data, totalLength, round])

    useEffect(() => {
        setTapeWeight(Number((consts.area * consts.density * consts.g / 1000000).toFixed(round)))
    }, [consts, round])

    useEffect(() => {
        const cube = bays.reduce((total, current) => {
            return total + Math.pow(Number(current.length), 3)
        }, 0)
        const sag = Math.pow(tapeWeight, 2) * (cube) / (24 * Math.pow(data.field_tension, 2))
        setSagCorr(-Number(sag.toFixed(round)))
    }, [tapeWeight, totalLength, data, bays, round])

    useEffect(() => {
        setCorrLength(totalLength + slopCorr + tensionCorr + tempCorr + sagCorr)
    }, [totalLength, slopCorr, tensionCorr, tempCorr, sagCorr, round])

    useEffect(() => {
        const attr = corrLength * data.above_sea_level / (consts.radius_of_the_earth * 1000)
        setAttrCorr(Number(attr.toFixed(round)))
    }, [data, corrLength, consts, round])

    return (
        <>
            <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Tape details</h4>
                        <p className="card-description"> Tape details </p>
                        <form className="forms-sample">
                            {Object.keys(consts).map(key => (
                                <Form.Group key={key} className="row">
                                    <label htmlFor={key} className="col-sm-3 col-form-label">{key}</label>
                                    <div className="col-sm-9">
                                        <Form.Control
                                            type="text"
                                            name={key} className="form-control"
                                            id={key}
                                            value={consts[key]}
                                            onChange={handleconstChange}
                                            placeholder={key}
                                            style={{ backgroundColor: 'unset', color: 'white' }}
                                        />
                                    </div>
                                </Form.Group>
                            ))}
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Data</h4>
                        <p className="card-description"> data </p>
                        <form className="forms-sample">
                            {Object.keys(data).map(key => (
                                <Form.Group key={key} className="row">
                                    <label htmlFor={key} className="col-sm-3 col-form-label">{key}</label>
                                    <div className="col-sm-9">
                                        <Form.Control
                                            type="text"
                                            name={key} className="form-control"
                                            id={key}
                                            value={data[key]}
                                            onChange={handleDataChange}
                                            placeholder={key}
                                            style={{ backgroundColor: 'unset', color: 'white' }}
                                        />
                                    </div>
                                </Form.Group>
                            ))}
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Bays (Spans)</h4>
                        <p className="card-description"> Bays (Spans) <button type="button" className="btn btn-primary btn-fw" onClick={handleAdd}>Add</button></p>
                        <form className="forms-sample">
                            {bays.map((item, id) => (
                                <Form.Group key={id}>
                                    <div className="row">
                                        <div className="col-sm-5">
                                            <label>Measured length of span</label>
                                            <Form.Control type="text" name="length" value={item.length} onChange={e => handleBayChange(e, id)} className="form-control-lg" placeholder="Username" aria-label="Username" style={{ backgroundColor: 'unset', color: 'white' }} />
                                        </div>
                                        <div className="col-sm-5">
                                            <label>Rise between ends</label>
                                            <Form.Control type="text" name="rise" value={item.rise} onChange={e => handleBayChange(e, id)} className="form-control-lg" placeholder="Username" aria-label="Username" style={{ backgroundColor: 'unset', color: 'white' }} />
                                        </div>
                                        <div className="col-sm-2">
                                            <button type="button" className="btn btn-primary btn-fw mt-4" onClick={() => handleRemove(id)}>Remove</button>
                                        </div>
                                    </div>
                                </Form.Group>
                            ))}
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <form className="forms-sample">
                            <Form.Group>
                                <label className="col-sm-3 col-form-label">Round to</label>
                                <div className="col-sm-9">
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        value={round}
                                        onChange={e => setRound(e.target.value)}
                                        placeholder="Round"
                                        style={{ backgroundColor: 'unset', color: 'white' }}
                                    />
                                </div>
                            </Form.Group>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Correction</h4>
                        <p className="card-description"> Correction </p>
                        <Form.Group className="row">
                            <label className="col-sm-3 col-form-label">Total length</label>
                            <div className="col-sm-9">
                                {bays.map((item, id) => (
                                    <span>= {item.length} + </span>
                                ))}
                                <p>= {totalLength}</p>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label className="col-sm-3 col-form-label">Slope correction</label>
                            <div className="col-sm-9">
                                <p>
                                    <math>
                                        = h<sup>2</sup>/2L
                                    </math>
                                </p>
                                {bays.map((item, id) => {
                                    if (!item.length) return (<></>)
                                    return (
                                        <span key={id}>
                                            <math>
                                                {item.rise}<sup>2</sup>/2 X {item.length}
                                            </math>
                                            <math> + </math>
                                        </span>
                                    )
                                })}
                                <p>= {slopCorr}</p>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label className="col-sm-3 col-form-label">Tension correction</label>
                            <div className="col-sm-9">
                                <p>
                                    <math>
                                        = (P - Ps)L / AE
                                    </math>
                                </p>
                                <div>
                                    <math>
                                        = ({data.field_tension} - {data.standard_tension}) X {totalLength} / {consts.area} X {consts.youngmodulus}
                                    </math>
                                </div>
                                <div>
                                    <math>
                                        = {tensionCorr}
                                    </math>
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label className="col-sm-3 col-form-label">Temprature correction</label>
                            <div className="col-sm-9">
                                <p>
                                    <math>
                                        = aL(t-ts)
                                    </math>
                                </p>
                                <div>
                                    <math>
                                        = {consts.coefficient_of_thermal} X {totalLength}({data.field_tem}-{data.standard_tem})
                                    </math>
                                </div>
                                <div>
                                    <math>
                                        = {tempCorr}
                                    </math>
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label className="col-sm-3 col-form-label">Wight of the tape per unit length w</label>
                            <div className="col-sm-9">
                                <p>
                                    <math>
                                        = adg
                                    </math>
                                </p>
                                <div>
                                    <math>
                                        = {consts.area} X {consts.density} X {consts.g}
                                    </math>
                                </div>
                                <div>
                                    <math>
                                        = {tapeWeight}
                                    </math>
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label className="col-sm-3 col-form-label">Sag correction c</label>
                            <div className="col-sm-9">
                                <p>
                                    <math>
                                        = (W<sup>2</sup>L<sup>3</sup>) / 24p<sup>2</sup>
                                    </math>
                                </p>
                                <div>
                                    <math>
                                        = ({tapeWeight}<sup>2</sup> X {totalLength}<sup>3</sup>) / 24 X {data.field_tension}<sup>2</sup>
                                    </math>
                                </div>
                                <div>
                                    <math>
                                        = {sagCorr}
                                    </math>
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label className="col-sm-3 col-form-label">Corrected length without attitude correction</label>
                            <div className="col-sm-9">
                                <p>
                                    <math>
                                        = total length + slop correction + tension correction + temperature correction + sag correction
                                    </math>
                                </p>
                                <div>
                                    <math>
                                        = {totalLength} + {slopCorr} + {tensionCorr} + {tempCorr} + {sagCorr}
                                    </math>
                                </div>
                                <div>
                                    <math>
                                        = {corrLength}
                                    </math>
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label className="col-sm-3 col-form-label">Attitude correction</label>
                            <div className="col-sm-9">
                                <p>
                                    <math>
                                        = LH / R
                                    </math>
                                </p>
                                <div>
                                    <math>
                                        = {corrLength} X {data.above_sea_level} / {consts.radius_of_the_earth} X 10<sup>3</sup>
                                    </math>
                                </div>
                                <div>
                                    <math>
                                        = {attrCorr}
                                    </math>
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label className="col-sm-3 col-form-label">Corrected length</label>
                            <div className="col-sm-9">
                                <p>
                                    <math>
                                        = Corrected length without attitude correction  - attitude correction
                                    </math>
                                </p>
                                <div>
                                    <math>
                                        = {corrLength} - {attrCorr}
                                    </math>
                                </div>
                                <div>
                                    <math>
                                        = {corrLength - attrCorr}
                                    </math>
                                </div>
                            </div>
                        </Form.Group>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Correction;