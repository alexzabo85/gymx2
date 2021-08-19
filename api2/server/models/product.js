
const qTypes = [
    'text',
    'email',
    'phone-number',
    'checkbox',
    'radiogroup',
    'dropdown',
    'slider',
    'date',
    'comment',
    'rating',
    'rating-bar',
    'image-picker',
    'image',
    'boolean',
    'html',
    'sign-pad',
    'file-upload',
    'panel',
    'panel-dynamic',
]


const productBody = {
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "dropdown",
                    "name": "This is My Question String.",
                    "choices": [
                        "item1",
                        "item2",
                        "item3"
                    ]
                }
            ]
        }
    ]
}