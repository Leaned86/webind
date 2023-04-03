/**
 * Created by Felipe Rodriguez Arias <ucifarias@gmail.com> on 28/05/2018.
 */

async function findByEspecialidad (idEspecialidad) {

  // idEspecialidad = '5b0c507e22d01a8c22f7d75c';
  let consultas = await Consulta.find().populate('medico').populate('paciente');
  consultas = consultas.filter(item => item.medico.especialidad === idEspecialidad);

  let pacientes = [];
  for (let item of consultas) {
    let exist = false;
    for (let inner of pacientes) {
      if (inner.id === item.paciente.id) {
        exist = true;
        break;
      }
    }
    if (exist === false) {
      let p = await Paciente.find({id: item.paciente.id})
        .populate('areaSalud')
        .populate('raza')
        .populate('sexo')
        .populate('hospital')
        .limit(1);
      pacientes.push(p[0]);
    }
  }

  return pacientes;
}

async function destroy (id) {
  let entity = await Paciente.findOne(id);
  entity['eliminado'] = true;
  let result = await Paciente.update(id, entity);
  console.log('Paciente Eliminado');
  return result;
}

async function find () {
  return await Paciente.find({eliminado: false});
}

async function findEliminados () {
  return await Paciente.find({eliminado: true});
}

async function findPacienteByHC (hcPaciente) {
  return await Paciente.find({hc: hcPaciente});
}

async function findPacienteByHC (hcPaciente) {
  return await Paciente.find({hc: hcPaciente});
}
async function findPacienteByCI (ciPaciente) {
  return await Paciente.find({ci: ciPaciente});
}

module.exports = {
  findByEspecialidad,
  destroy,
  findEliminados,
  find,
  findPacienteByHC,
  findPacienteByCI,
};
