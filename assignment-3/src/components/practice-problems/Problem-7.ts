// Problem 7 - server action vs. client fetch to a route handler.
//
// This assignment uses a server action (src/app/actions.ts +
// <form action={formAction}>). Contrasting against the client-fetch
// alternative it could have used instead.
//
// Run individually: npx tsx src/components/practice-problems/Problem-7.ts

const contrast = {
  whereValidationRuns:
    'identically on the server either way - signupSchema.safeParse runs inside submitSignup ' +
    'here, and would run just as server-side inside a route handler in a fetch version. ' +
    'Whichever transport delivered the data never changes where it is trusted.',
  whereSecretsStay:
    "the server action's code runs entirely server-side, so API_BASE_URL never needs to " +
    'reach the browser bundle - there is no endpoint URL to expose because there is no ' +
    'separate endpoint to call. A client-fetch version would need to expose at least the ' +
    "endpoint's path to the browser.",
  javascriptDisabled:
    '<form action={formAction}> is a real <form> pointing at a server action - without ' +
    'JavaScript the browser still does a genuine POST and Next.js still runs the action. ' +
    'A client-fetch version needs JavaScript to do anything at all; submit does nothing ' +
    'without it.',
};

console.log('Problem 7 - server action vs. client fetch:');
console.log(JSON.stringify(contrast, null, 2));

console.log(
  '\nDEEPER - validating only on the client: the exploit is trivial - anyone can skip the' +
  ' browser and the form entirely and curl/Postman/script straight to whatever endpoint' +
  ' accepts the data, with any payload, since client checks are JavaScript that simply' +
  ' never runs outside a page executing it. That is exactly why submitSignup re-runs' +
  ' parseForm against signupSchema on the server regardless of what the client already' +
  ' checked - client validation is real UX, but carries zero security weight alone.'
);
