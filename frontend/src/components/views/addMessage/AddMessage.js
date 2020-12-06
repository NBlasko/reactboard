import React, { useState } from 'react';

import AddMessageSubmitSuccess from './AddMessageSubmitSuccess';
import AddMessageForm from './AddMessageForm';

function AddMessage(props) {
    const [isSubmited, setSubmited] = useState(false);
    return (
        <div className="shadow-lg p-3 m-2 bg-white minHeight rounded">
            {
                (isSubmited)
                    ? <AddMessageSubmitSuccess
                        setSubmited={setSubmited}

                    />
                    : <AddMessageForm
                        setSubmited={setSubmited}
                        {...props} />}
        </div>

    );
}




export default AddMessage;