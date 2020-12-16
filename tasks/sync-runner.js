function syncRunner(taskDefs) {
  return runSync;

  function runSync() {
    return taskDefs.map(runTask);
  }

  function runTask({ fn, args }) {
    return fn.apply(fn, args);
  }
}

module.exports = syncRunner;
