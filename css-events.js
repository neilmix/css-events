(() => {
  const sheets = document.querySelectorAll("style[type='text/css-events']");
  for (let sheet of sheets) {
    const rules = parse(sheet.textContent);
    const events = {};
    for (let rule of rules) {
      if (!events[rule.event]) events[rule.event] = [];
      events[rule.event].push(rule);
    }

    for (let event in events) {
      document.addEventListener(event, (e) => {
        for (let rule of events[event]) {
          if (e.target.matches(rule.targets)) {
            execute(rule, e);
          }
        }
      });
    }
  }

  function parse(text) {
    let cur = 0;
    const rules = [];

    while (cur < text.length) {
      wss();
      require(/^@event/);
      wsp();
      let event = require(/^[a-zA-Z]+/);
      wsp();
      let targets = require(/^\(([^\)]+)\)/);
      wsp();
      let action = require(/^(add|remove|toggle|select)/);
      wsp();
      let className = require(/^'([^']*)'/);
      wss();
      let updates = null;
      if (match(/^at/)) {
        wsp();
        updates = require(/^\(([^\)]+)\)/);
      }
      wss();
      require(/^;/);
      wss();

      rules.push({ event, targets, action, className, updates });
    }
    return rules;

    function wss() {
      cur += text.slice(cur).match(/^\s*/m)[0].length;
    }

    function wsp() {
      require(/^\s+/m);
    }

    function require(regex) {
      let result = match(regex);
      if (!result) {
        error();
      }
      return result;
    }

    function match(regex) {
      const result = text.slice(cur).match(regex);
      if (result) {
        cur += result[0].length;
        return result[1] || result[0];
      } else {
        return null;
      }
    }

    function error() {
      let line = 1;
      let n = cur;
      const lines = text.split(/\n/);
      while (n >= lines[line - 1].length) {
        if (line > lines.length) {
          throw new Error(`css-events: unexpected end of input while generating error message`);
        }
        n -= lines[line - 1].length;
        line++;
      }
      throw new Error(`css-events: unexpected token at line ${line}, char ${n + 1}`);
    }
  }

  function execute(rule, trigger) {
    const targets = document.querySelectorAll(rule.targets);
    const updates = rule.updates ? document.querySelectorAll(rule.updates) : targets;
    if (targets.length != updates.length) {
      console.error(`css-events: event targets and updates targets must be equal in count.
        ${rule.targets}: ${targets.length}
        ${rule.updates}: ${updates.length}`);
      return;
    }
    for (let i = 0; i < targets.length; i++) {
      if (targets[i] == trigger.target) {
        update(updates[i], rule.action == "select" ? "add" : rule.action, rule.className);
      } else if (rule.action == "select") {
        update(updates[i], "remove", rule.className);
      }
    }
  }

  function update(target, action, className) {
    const names = className.split(/\s+/);
    for (let name of names) {
      if (action == "add") {
        target.classList.add(name);
      } else if (action == "remove") {
        target.classList.remove(name);
      } else if (action == "toggle") {
        target.classList.toggle(name);
      } else {
        throw new Error(`css-events: unknown action ${action}`);
      }
    }
  }
})();
