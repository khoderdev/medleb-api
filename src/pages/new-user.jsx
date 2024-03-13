import { Helmet } from 'react-helmet-async';

import { NewUserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function NewUserPage() {
  return (
    <>
      <Helmet>
        <title> Add new user </title>
      </Helmet>

      <NewUserView />
    </>
  );
}
