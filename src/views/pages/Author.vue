<template>
  <body>
    <div class="container-contact">
      <h2 class="brand"><span>Xuân Mai</span> Corpt</h2>
      <div class="wrapper_">
        <div class="company-info">
          <h4>Trần Văn Nghĩa</h4>
          <ul>
            <li>
              <i class="fa fa-road"></i> 118/63 Bạch Đằng, P.24, Q.BT- HCM
            </li>
            <li><i class="fa fa-phone"></i> (084) 0903917963 - 0947501512</li>
            <li><i class="fa fa-envelope"></i> Nghiatv@gmail.com</li>
          </ul>
        </div>
        <div class="contact">
          <h4>Gửi Email</h4>
          <div class="alertmess">
            Tin nhắn của bạn đã được gửi đến chúng tôi...
          </div>
          <form action="javascript:void(0);" id="contactForm">
            <p>
              <label>Họ & tên</label>
              <input
                v-model="todo.name"
                type="text"
                name="name"
                id="focus_todo"
                required
              />
            </p>
            <p>
              <label>Công ty</label>
              <input
                v-model="todo.company"
                type="text"
                name="company"
                id="company"
              />
            </p>
            <p>
              <label>Email</label>
              <input
                v-model="todo.email"
                type="email"
                name="email"
                id="email"
                required
              />
              <!-- <input for="email" type="email" placeholder="Please enter your email here" required v-model="todo.email" @blur="validateEmail" > -->
            </p>
            <p>
              <label>Điện thoại</label>
              <input v-model="todo.phone" type="text" name="phone" id="phone" />
            </p>
            <!-- <p class="full">
              <label>Địa chỉ</label>
              <textarea  v-model="todo.fileupload" name="fileupload" rows="1" id="fileupload"></textarea>
            </p> -->

            <p>
              <label>Chọn file</label>
              <input
                class="files"
                type="file"
                ref="files"
                id="files"
                multiple
              />
            </p>
            <p>
              <button
                @click="uploadVuejs()"
                type="button"
                id="send"
                style="margin-top: 33px !important"
              >
                Upload
              </button>
            </p>
            <p class="progress">
              <progress
                value="100"
                max="100"
                id="progress"
                style="width: -webkit-fill-available"
              ></progress>
            </p>
            <p class="progress1">
              <!-- Lúc đầu là filename ,sau upload là url -->
              <input
                type="text"
                v-model="todo.fileupload"
                name="fileupload"
                id="progress1"
              />
            </p>
            <p class="full">
              <label>Nội dung tin</label>
              <textarea
                v-model="todo.message"
                name="message"
                rows="2"
                id="message"
              ></textarea>
            </p>
            <p class="full" v-if="!edit">
              <button
                :disabled="!isValid"
                @click="createTodo()"
                href="javascript:void(0);"
              >
                THỰC HIỆN GỬI TIN
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
    <br />
  </body>
</template>

<script>
import utility from '@/common/utility'
import { mapState } from 'vuex'

const object = 'messages'
const firetore = window.firebase.firestore() // For Firestore Database
// const realTimeData = window.firebase.database(); // For RealTime Database
const firestorage = window.firebase.storage() // For Storage
const messagesRef = window.firebase.database().ref(object)

export default {
  name: 'contactAuthor',
  mixins: [utility],
  components: {},
  data() {
    return {
      files: [],
      colchecked: true,
      edit: false,
      todos: [],
      todo_: [],
      todo: {
        name: '',
        company: '',
        email: '',
        phone: '',
        fileupload: '',
        message: '',
        date: '',
      },
      columns: [
        {
          label: 'Name',
          field: 'name',
        },
        {
          label: 'Company',
          field: 'company',
        },
        {
          label: 'Email',
          field: 'email',
        },
        {
          label: 'Mobile',
          field: 'phone',
        },
        // {
        //     label: 'message',
        //     field: 'message',
        // },
        {
          label: 'Date',
          field: 'date',
        },
        {
          label: 'Hiệu chỉnh',
          field: 'btnedit',
          html: true,
          tdClass: 'text-center',
          width: '90px', // Phải có 110 - btn +40
          //hidden: !this.optprint,
        },
      ],
    }
  },
  mounted() {
    this.getFiretore()
  },
  methods: {
    uploadVuejs() {
      this.files = this.$refs.files.files
      if (this.files.length != 0) {
        for (let i = 0; i < this.files.length; i++) {
          var storage = firestorage.ref(`contact/${this.files[i].name}`)
          //upload file
          var upload = storage.put(this.files[i])
          //update progress bar
          // var fileUp = this.files[i].name ;  // Vì không tham chiếu This được
          var todo = this.todo // Vì không tham chiếu This được
          document.querySelector('.progress').style.display = 'block'
          document.querySelector('.progress1').style.display = 'block'
          document.getElementById('progress1').value = this.files[i].name
          upload.on(
            'state_changed',
            function progress(snapshot) {
              var percentage =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              document.getElementById('progress').value = percentage
            },

            function error() {
              alert('error uploading file')
            },
            function complete() {
              storage
                .getDownloadURL()
                .then(function (url) {
                  todo.fileupload = url // gán v-model
                  console.log('Click link : ', url, todo)
                  setTimeout(function () {
                    document.querySelector('.progress').style.display = 'none'
                    document.querySelector('.progress1').style.display = 'none'
                    document.querySelector('.files').value = ''
                  }, 3000)
                })
                .catch(function (error) {
                  console.log('error encountered', error)
                })
            },
          )
        }
      } else {
        alert('No file chosen')
      }
    },
    mySreach() {},
    onCellClick(params) {
      if (params.column.field == 'btnedit') {
        // Mới đổi ----> toElement.id--->srcElement.id) {
        switch (params.event.srcElement.id) {
          case '1':
            this.editTodo(params.row.originalIndex, params.row)
            break
          case '2':
            this.deleteTodo(params.row.originalIndex, params.row)
            break
        }
      }
    },
    restore() {
      if (!this.todo_['id_']) return
      var dat = this.todo_ // Phải đổi tên FIELD & dùng ['abc'] MỚI OK
      this.todo['company'] = dat.company_
      this.todo['fileupload'] = dat.fileupload_
      this.todo['name'] = dat.name_
      this.todo['email'] = dat.email_
      this.todo['phone'] = dat.phone_
      this.todo['message'] = dat.message_
    },
    editTodo(index, row) {
      this.restore()
      var tmp = this.todos[index]
      this.todo_ = {
        // Hoàn trả những field có thể sửa
        name_: tmp.name,
        company_: tmp.company,
        email_: tmp.email,
        phone_: tmp.phone,
        fileupload_: tmp.fileupload,
        message_: tmp.message,
        id_: row.id,
        index_: index,
      }
      this.todo = tmp // Để sửa
      this.edit = true // Chỉ lưu sửa - không gửi được - Muốn gửi không chọn Edit
      document.getElementById('focus_todo').focus()
    },
    deleteTodo(index, row) {
      //console.log(222,index, row);
      if (
        !confirm('Are you sure to delete this record : ' + (index + 1) + ' ? ')
      ) {
        return
      }
      this.restore() // Nếu đang sửa thì phục hồi Vì có thể sửa dòng khác dòng xóa
      firetore
        .collection(object)
        .doc(row.id)
        .delete()
        .then(() => {
          this.todos.splice(index, 1)
          //console.log(this.customers);
          console.log('Document successfully deleted!')
        })
        .catch(function (error) {
          console.error('Error removing document: ', error)
        })
    },

    getFiretore() {
      var data = []
      firetore
        .collection(object)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            var tmp = doc.data() // Lấy Data
            tmp['id'] = doc.id // Thêm ID
            // tmp.sort(fn($a, $b) => strcmp($a->date, $b->date));
            data.push(tmp) // push vào data is var public
          })
        })
        .then(() => {
          this.todos = data
          this.todos.forEach((item) => {
            item.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
          })
          //console.log(this.todos);
        })
    },
    createTodo() {
      // =====1--for  realtime-Database
      this.todo.date = new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '')
      var newMessageRef = messagesRef.push()
      newMessageRef.set(this.todo)
      // ====2--for  Cloud-Firestore
      firetore
        .collection(object)
        .add(this.todo) // Cách 1
        .then((result) => {
          //console.log(result, result.id);
          this.todo.btnedit = `<a class="fa fa-pencil-square-o text-info mr-1"  id=1 ></a> <a class="fa fa-trash-o text-warning mr-1"  id=2 ></a>`
          this.todo.id = result.id // Lấy id mới tạo
          this.todos.push(this.todo)
          this.restore() // Nếu đang sửa thì phục hồi lại list
          document.querySelector('.alertmess').style.display = 'block'
          setTimeout(function () {
            document.querySelector('.alertmess').style.display = 'none'
          }, 3000)
          this.reset()
        })
        .catch((error) => {
          console.error('Error adding document: ', error)
        })
      //test = firetore.collection(object).doc().set(this.todo) ; // Cách 2
    },
    updateTodo() {
      firetore
        .collection(object)
        .doc(this.todo.id)
        .set({
          name: this.todo.name,
          company: this.todo.company,
          email: this.todo.email,
          phone: this.todo.phone,
          fileupload: this.todo.fileupload,
          message: this.todo.message,
          date: this.todo.date,
        })
        .then(() => {
          document.querySelector('.alertmess').style.display = 'block'
          setTimeout(function () {
            document.querySelector('.alertmess').style.display = 'none'
          }, 3000)
          this.reset()
        })
    },

    reset() {
      this.files = []
      this.todo_ = []
      this.todo = {
        name: '',
        company: '',
        email: '',
        phone: '',
        fileupload: '',
        message: '',
      }
    },
  },
  computed: {
    ...mapState(['loggedUser']),
    validation: function () {
      //this.todo.tygia = this.format_so(this.todo.tygia,2) ;
      return {
        company: !!this.todo.company.trim(),
        // fileupload: !!this.todo.fileupload.trim(),
        name: !!this.todo.name.trim(),
        phone: !!this.todo.phone.trim(),
        message: !!this.todo.message.trim(),
        email: this.todo.email.includes('@'),
        // email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.newdmtiente.email)
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    },
  },
} // export default
</script>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  /*background:#92bde7;*/
  color: #485e74;
  line-height: 1.6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  /*padding:1em;*/
}

.progress {
  display: none;
}
.progress1 {
  display: none;
}

.container-contact {
  /* background: #92bde7; */
  background: beige;
  max-width: initial;
  margin-left: 0px;
  margin-right: 0px;
  padding: 1em;
}

ul {
  list-style: none;
  padding: 0;
}

.brand {
  text-align: center;
}

.brand span {
  color: #fff;
}

.wrapper_ {
  box-shadow: 0 0 20px 0 rgba(72, 94, 116, 0.7);
}

.wrapper_ > * {
  padding: 1em;
}

.company-info {
  background: #c9e6ff;
}

.company-info h3,
.company-info ul {
  text-align: center;
  margin: 0 0 1rem 0;
}

.contact {
  background: #f9feff;
}

/* FORM STYLES */
.contact form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}

.contact form label {
  display: block;
}

.contact form p {
  margin: 0;
}

.contact form .full {
  grid-column: 1 / 3;
}

.contact form button,
.contact form input,
.contact form textarea {
  width: 100%;
  padding: 1em;
  border: 1px solid #c9e6ff;
}

.contact form button {
  background: #c9e6ff;
  border: 0;
  text-transform: uppercase;
}

.contact form button:hover,
.contact form button:focus {
  background: #92bde7;
  /* color:rgb(32, 40, 116); */
  color: #fff;
  outline: 0;
  transition: background-color 2s ease-out;
}

.alertmess {
  text-align: center;
  padding: 10px;
  background: #79c879;
  color: #fff;
  margin-bottom: 10px;
  display: none;
}

/* LARGE SCREENS */
@media (min-width: 700px) {
  .wrapper_ {
    display: grid;
    grid-template-columns: 2fr 5fr;
  }

  .wrapper_ > * {
    padding: 2em;
  }

  .company-info h3,
  .company-info ul,
  .brand {
    text-align: left;
  }
}
</style>
