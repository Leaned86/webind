/**
 * PacienteController
 *
 * @description :: Server-side logic for managing Paciente_Controller
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */




const update = (req, res) => {
  return WorkService.update(req, res, Paciente);
};

const destroy = (req, res) => {
  // return WorkService.destroy(req, res, Paciente);
  let id = req.param('id');
  let result = PacienteService.destroy(id);
  return res.json({result});
};

const find = async (req, res) => {
  let result = await PacienteService.find();
  return res.json(result);
};

const findEliminados = async (req, res) => {
  let result = await PacienteService.findEliminados();
  return res.json(result);
};

const findPacient = (req, res) => {
  let searchQuery = {};

  if (req.param('HC')) {
    searchQuery.hc = req.param('HC');
  }

  if (req.param('CI')) {
    searchQuery.persona = {};
    searchQuery.persona.ci = req.param('CI');
  }

  if (req.param('name')) {
    if (!searchQuery.persona) {
      searchQuery.persona = {};
    }
    searchQuery.persona.name = req.param('name');
    searchQuery.persona.lastname = req.param('name');
  }

  if (req.param('fullname')) {
    if (!searchQuery.persona) {
      searchQuery.persona = {};
    }
    searchQuery.persona.fullname = req.param('fullname');
  }

  if (!searchQuery.persona && !searchQuery.hc) {
    return res.json({status: 'error', info: 'No hay información suficiente para realizar la búsqueda.'});
  }
  else {
    DatosPacienteService.searchQuery(searchQuery, function (err, result) {
      if (err) {
        return res.json({status: 'error', info: 'Hubo un error al realizar la búsqueda ' + result});
      }
      else {
        console.log(JSON.stringify(result));
        return res.json({status: 'ok', info: result});
      }
    });
  }
};

const findMorePacientInfo = (req, res) => {
  let pacientQuery = {};
  pacientQuery = req.param('pacient');
  console.log(JSON.stringify(pacientQuery));

  if (!pacientQuery || !pacientQuery.datos_paciente) {
    return res.json({status: 'error', info: 'No hay información suficiente para realizar la búsqueda.'});
  }
  else {
    DatosPacienteService.searchMoreQueryInfo(pacientQuery, function (err, result) {
      if (err) {
        return res.json({status: 'error', info: 'Hubo un error al realizar la búsqueda ' + result});
      }
      else {
        console.log(JSON.stringify(result));
        return res.json({status: 'ok', info: result});
      }
    });
  }
};

const getPacientesPorEspecialidad = async (req, res) => {
  const idEspecialidad = req.param('idEspecialidad');
  const pacientes = await PacienteService.findByEspecialidad(idEspecialidad);
  return res.json({pacientes});
};

const getPacientesPorHC = async (req, res) => {
  const hc = req.param('hc');
  const paciente = await PacienteService.findPacienteByHC(hc);
  return res.json({paciente});
};

const getPacientesPorCI = async (req, res) => {
  const ci = req.param('ci');
  const paciente = await PacienteService.findPacienteByCI(ci);
  return res.json({paciente});
};

const findPacientesByEspecialidad = async (req, res) => {
  const especialidadId = req.param('especialidadId');

  try {
    pacientes = await Paciente.findPacientesByEspecialidad(especialidadId);
    return res.json(pacientes);
  } catch (err) {
    return res.negotiate(err);
  }

};



module.exports = {
  find,
  destroy,
  findPacient,
  findMorePacientInfo,
  getPacientesPorEspecialidad,
  findEliminados,
  getPacientesPorHC,
  getPacientesPorCI,
  findPacientesByEspecialidad,

  findPopulatedForEdit: async function (req, res) {
    let id = req.param('id');

    try {
      let paciente = await Paciente.findPopulatedForEdit(id);
      // console.log(p);

      return res.json(paciente);
    } catch (err) {
      return res.negotiate(err);
    }
  },
//-------------------------------------------------------------------------------------------------------------------
 //recibe el id del paciente y devuelve el paciente populado con todo
  findFullyPopulated: async function (req, res) {
    let id = req.param('id');
    try {
      let paciente = await Paciente.findFullyPopulated(id);
      // console.log(p);
      return res.json(paciente);
    } catch (err) {
      return res.negotiate(err);
    }
  },
  //-------------------------------------------------------------------------------
  create : async function(req, res) {

    //hasta aqui llega bien paciente y familiar
    const familiar = req.param('familiar');
    const paciente = req.param('paciente');
    var antF = req.param('antFamiliar');

    // delete paciente.antecedente.antFamiliar;


    const antPrenatal = paciente.antecedente.antPrenatal;
    const antPerinatal = paciente.antecedente.antPerinatal;
    const antPostnatal = paciente.antecedente.antPostnatal;
    const antPersonal = paciente.antecedente.antPersonal;


    try {
      var pre = await AntPrenatal.create(antPrenatal);
      var peri = await AntPerinatal.create(antPerinatal);
      var post = await AntPostnatal.create(antPostnatal);
      var per = await AntPersonal.create(antPersonal);

    } catch (err) {
      console.log(err);
      return res.negotiate(err);
    }

    const antecedente = {
      antPrenatal: pre.id,
      antPerinatal: peri.id,
      antPostnatal: post.id,
      antPersonal: per.id,
    };

    try {
      paciente.antecedente = await Antecedente.create(antecedente);
      delete paciente.municipio;


      familiar.paciente = await Paciente.create(paciente);
      antF.paciente = familiar.paciente.id;
      antF = await AntFamiliar.create(antF);
      var fam = await Familiar.create(familiar);
      return res.ok([fam, familiar.paciente]);
    } catch (err) {
      console.log(err);
      return res.negotiate(err);
    }
  },

//-------------------------------------------------------------------------------------------------------------------
  update: async function (req, res) {
    var familiar = req.param('familiar');
    var paciente = req.param('paciente');
    var antFamiliar = req.param('antFamiliar');
    // console.log(familiar);
    // console.log(paciente);

    var antPrenatal = paciente.antecedente.antPrenatal;
    var antPerinatal = paciente.antecedente.antPerinatal;
    var antPostnatal = paciente.antecedente.antPostnatal;
    var antPersonal = paciente.antecedente.antPersonal;

    try {
      var pre = await AntPrenatal.update(antPrenatal.id, antPrenatal);
      var peri = await AntPerinatal.update(antPerinatal.id, antPerinatal);
      var post = await AntPostnatal.update(antPostnatal.id, antPostnatal);
      var per = await AntPersonal.update(antPersonal.id, antPersonal);
    } catch (err) {
      return res.negotiate(err);
    }

    var antecedente = {
      antPrenatal: pre.id,
      antPerinatal: peri.id,
      antPostnatal: post.id,
      antPersonal: per.id
    };

    delete paciente.municipio;
    paciente.areaSalud = paciente.areaSalud.id;
    paciente.antecedente = paciente.antecedente.id;
    delete paciente.familiares;
    delete paciente.antFamiliar;

    try {
      console.log(familiar);
      console.log(paciente);
      var f = await Familiar.update(familiar.id, familiar);
      var p = await Paciente.update(paciente.id, paciente);
      var af = await AntFamiliar.update(antFamiliar.id, antFamiliar);

      return res.ok([f,p,af]);
    } catch(err) {
      console.log(err);
      return res.negotiate(err);
    }


  }
};

