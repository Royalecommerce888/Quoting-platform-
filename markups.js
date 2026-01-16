const db = require("./db");

async function getPartnerById(id) {
  const { rows } = await db.query(
    "SELECT * FROM partners WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function getMarkupRule(upstreamId, downstreamId) {
  const { rows } = await db.query(
    "SELECT * FROM markups WHERE upstream_partner_id = $1 AND downstream_partner_id = $2",
    [upstreamId, downstreamId]
  );
  return rows[0] || null;
}

// Starting from a child (like C), climb up C -> B -> A and collect markups
async function getMarkupChain(partnerId) {
  const percentages = [];
  let current = await getPartnerById(partnerId);

  while (current && current.parent_partner_id) {
    const parent = await getPartnerById(current.parent_partner_id);
    const rule = await getMarkupRule(parent.id, current.id);
    if (rule) {
      percentages.push(Number(rule.percentage)); // e.g. 0.10, 0.03
    }
    current = parent;
  }

  return percentages;
}

function applyMarkups(base, chain) {
  return chain.reduce((acc, pct) => acc * (1 + pct), base);
}

module.exports = { getMarkupChain, applyMarkups };

